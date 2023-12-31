// server/index.js
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;
const http = require("http");
const verifyToken = require("./AuthMiddleware"); // Importa el middleware de autenticación
const { Storage } = require("@google-cloud/storage");
const fileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const moment = require('moment');
const bodyParser = require('body-parser');
const {
  createTcpPool,
  insertDriver,
  insertTutor,
  loginTutor,
  listDrivers,
  createRequest,
  deactivateOldSessions,
  createSession,
  saveImageURLToDatabase,
  getTutorDetails,
  listStudents,
  insertStudent,
  checkRutExists,
} = require('./db');
const cookieParser = require('cookie-parser'); // Importa el middleware de cookies para leer las cookies en las solicitudes
const dotenv = require('dotenv');
dotenv.config();

const storage = new Storage({keyFilename: 'server/kowapp1-6cf9f0a41992.json',projectId: 'kowapp1'}); // Configuración de Google Cloud Storage
const bucketName = 'kowap'; // Reemplaza con el nombre de tu bucket

app.use(cookieParser()); // Habilita el uso de cookies en las solicitudes

app.use(cors({ 
  origin: 'http://localhost:3000', // Permitir solo el origen del cliente
  credentials: true // Permitir cookies en solicitudes de origen cruzado
}));

app.get("/", (req, res) => {
  res.send("¡El servidor está funcionan!");
});

app.listen(port, () => {
  console.log(`Servidor en funcionamiento ${port}`);
});

app.use(express.json()); // Habilita el uso de JSON para las solicitudes POST

app.use(fileUpload()); // Habilita el uso de multipart/form-data para cargar archivos en el servidor

// Crear la conexión cuando la aplicación se inicia.
let db;
const initDatabaseConnection = async () => {
  try {
    db = await createTcpPool();
    console.log("Conexión a la base de datos establecida con éxito.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    // Reintentar la conexión o salir de la aplicación según sea necesario
  }
};

initDatabaseConnection();

// Ruta para insertar un nuevo usuario en la tabla "drivers"
app.post("/insert-driver", async (req, res) => {
  try {
    // Recibe los datos del conductor desde la solicitud POST
    const {
      nombre,
      apellido,
      rut,
      email,
      telefono,
      telefonoEmergencia,
      contraseña,
      modeloVehiculo,
      patenteVehiculo,
      capacidadVehiculo,
    } = req.body;

    // Llama a la función insertDriver para insertar al conductor en la base de datos
    const newDriver = await insertDriver(
      nombre,
      apellido,
      rut,
      email,
      telefono,
      telefonoEmergencia,
      contraseña,
      modeloVehiculo,
      patenteVehiculo,
      capacidadVehiculo
    );

    res.json({ message: "Conductor registrado con éxito", newDriver });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al registrar el conductor",
        error: error.message,
      });
  }
});

app.get("/check-session", (req, res) => {
  try {
    const token = req.cookies.token; // Asume que estás usando cookies para la sesión
    if (!token) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Sesión inválida' });
      }
      return res.status(200).json({ message: 'Sesión válida', userId: decoded.id });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar la sesión.' });
  }
});


// Ruta para autenticar al usuario tutor
app.post("/login", async (req, res) => {
  const { email, contraseña } = req.body;
  
  try {
    const tutor = await loginTutor(email, contraseña); // Verifica si el tutor existe y las credenciales son válidas
    if (tutor) {
      await deactivateOldSessions(tutor.id); // Desactiva las sesiones anteriores del tutor
      const token = await createSession(tutor.id); // Crea una nueva sesión para el tutor y devuelve el token

      // Establecer el token en una cookie HttpOnly
      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'lax', // Usa 'None' si estás implementando en dominios cruzados con HTTPS
        // secure: process.env.NODE_ENV === 'production', // Descomentar en producción
        maxAge: 3 * 60 * 60 * 1000, // 1 hora en milisegundos
      });

      // No enviar la contraseña ni información sensible al cliente
      const { password, ...tutorData } = tutor;

      res.status(200).json({ user: tutorData }); // Devuelve los detalles del tutor al cliente
    } else {
      // Manejar el caso de tutor no encontrado o credenciales inválidas
      res.status(401).json({ message: 'Credenciales inválidas.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión. Intenta nuevamente.' });
  }
});


app.post("/verify-email", async (req, res) => {
  const { email, code } = req.body;

  try {
    // Verifica si el código coincide y aún no ha expirado
    const isValid = await db("verification_codes")
      .where({
        email: email,
        code: code,
      })
      .andWhere("expiry_date", ">", new Date())
      .first();

    if (isValid) {
      // Marca el correo electrónico del usuario como verificado
      await db("tutors")
        .where({ email: email })
        .update({ verificated_email: true });

      res.json({
        success: true,
        message: "Correo electrónico verificado con éxito.",
      });
    } else {
      res.json({ success: false, message: "Código inválido o expirado." });
    }
  } catch (error) {
    console.error("Error al verificar el correo electrónico:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Ocurrió un error al verificar el correo electrónico.",
      });
  }
});

app.post("/logout", (req, res) => {
  // Borrar la cookie 'token' estableciendo su valor a una cadena vacía y su expiración a una fecha pasada
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Fecha pasada para que la cookie expire inmediatamente
    sameSite: 'lax',
    // secure: process.env.NODE_ENV === 'production', // Descomentar esta línea en un entorno de producción si estás utilizando HTTPS
  });

  // No es necesario verificar el token ya que simplemente estás cerrando la sesión y borrando la cookie
  res.status(200).json({ message: "Sesión cerrada correctamente." });
});


// Usa la misma conexión para múltiples solicitudes
app.post("/insert-tutor", async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      rut,
      email,
      telefono,
      telefonoEmergencia,
      contraseña,
      nombreNino,
      apellidoNino,
      residencia,
      residenciaEmergencia,
      escuela,
    } = req.body;
    const newtutor = await insertTutor(
      nombre,
      apellido,
      rut,
      email,
      telefono,
      telefonoEmergencia,
      contraseña,
      nombreNino,
      apellidoNino,
      residencia,
      residenciaEmergencia,
      escuela,
      db
    ); // Pasa la conexión `db` a la función
    res.json({ message: "Tutor registrado con éxito", newtutor });
  } catch (error) {
    if (error.field) {
      res.status(400).json({
        message: error.message,
        field: "duplicateEmailOrPhone",
        duplicateField: error.field,
      });
    } else {
      res
        .status(500)
        .json({ message: "Error interno del servidor", error: error.message });
    }
  }
});

//app.use(verifyToken);  // Esto hace que el middleware se aplique a todas las rutas que vienen después de esto

// listar conductores
app.get("/list-drivers", verifyToken, async (req, res) => {
  try {
    const drivers = await listDrivers();
    res.json(drivers);
  } catch (error) {
    console.error("Error al listar los conductores:", error);
    res.status(500).send("Error al obtener los conductores");
  }
});

// listar estudiantes 
app.get("/list-students", verifyToken, async (req, res) => {
  try {
    const students = await listStudents(req.userId);
    res.json(students);
  } catch (error) {
    console.error("Error al listar los estudiantes:", error);
    res.status(500).send("Error al obtener los estudiantes");
  }
});

// Endpoint para agregar un nuevo estudiante
app.post('/add-student', verifyToken, async (req, res) => {
  try {
    const tutorId = req.userId;  // El ID del tutor se extrae del objeto req.user establecido por el middleware verifyToken
    const studentData = req.body; // Obtiene los datos del estudiante del cuerpo de la solicitud
    const newStudentId = await insertStudent(studentData, tutorId); // Inserta el estudiante en la base de datos
    res.status(201).json({ student_id: newStudentId, message: 'Estudiante agregado con éxito' });
  } catch (error) {
    console.error('Error al agregar el estudiante:', error);
    res.status(500).json({ message: 'Error al agregar el estudiante' });
  }
});

app.get('/check-student/:rut', async (req, res) => {
  try {
    const rut = req.params.rut;
    const exists = await checkRutExists(rut);
    console.log('RUT exists:', exists); // Agregar para depuración
    res.json({ exists });
  } catch (error) {
    console.error('Error en la ruta /check-student:', error);
    res.status(500).send('Error en el servidor');
  }
});


// endpoint para crear una solicitud
app.post("/create-request", verifyToken, async (req, res) => {
  try {
    // El tutorId se extrae del token JWT decodificado
    const tutorId = req.userId;
    const { driverId, status, message } = req.body;
    const requestId = await createRequest(tutorId, driverId, status, message);
    res.json({ success: true, requestId: requestId });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al crear la solicitud" });
  }
});


app.get("/screen-tutor", verifyToken, (req, res) => {
  res.json([{ message: "¡Bienvenido Tutor!" }]); // Send data as an array
});

app.get('/tutor-profile', verifyToken, async (req, res) => {
  // req.userId debe ser establecido por el middleware verifyToken después de verificar el token
  const tutorId = req.userId; 

  try {
    const tutorDetails = await getTutorDetails(tutorId); // Obtiene los detalles del tutor de la base de datos

    const { password, ...tutorData } = tutorDetails; // No enviar la contraseña al cliente
    
    res.json(tutorData); // Envía los datos del tutor al cliente
  } catch (error) {
    console.error('Error al obtener el perfil del tutor:', error);
    res.status(500).json({ message: 'Error al obtener la información del perfil' });
  }
});


// Datos de estudiantes (simulando una base de datos)
const studentData = [
  { id: 1, name: 'Estudiante 1', tutorId: 101, surname: 'Apellido 1' },
  { id: 2, name: 'Estudiante 2', tutorId: 102, surname: 'Apellido 2' },
  // Otros estudiantes...
];

// Función para obtener estudiantes asignados a un tutor
async function listStudentsByTutor(tutorId) {
  // Filtra los estudiantes que tienen el mismo tutorId que el proporcionado
  const assignedStudents = studentData.filter(student => student.tutorId === tutorId);

  return assignedStudents;
}

// Ruta para obtener información del estudiante
app.get('/student-info', verifyToken, async (req, res) => {
  try {
    const tutorId = req.userId;

    const assignedStudents = await listStudentsByTutor(tutorId);

    console.log('Assigned Students:', assignedStudents); // Agrega este log para verificar si se están enviando los datos

    res.json(assignedStudents);
  } catch (error) {
    console.error('Error al obtener datos del estudiante:', error);
    res.status(500).json({ message: 'Error al obtener datos del estudiante' });
  }
});


app.use(bodyParser.urlencoded({ extended: true }));



// Endpoint para recibir la ubicación del cliente
app.post('/api/ubicacion', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Insertar la ubicación en la base de datos
    const insertQuery = 'INSERT INTO ubicaciones (latitude, longitude) VALUES ($1, $2) RETURNING *';
    const values = [latitude, longitude];

    const result = await pool.query(insertQuery, values);
    const insertedLocation = result.rows[0];

    res.status(200).json({ message: 'Ubicación recibida y almacenada correctamente.', location: insertedLocation });
  } catch (error) {
    console.error('Error al procesar la ubicación:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.post('/student-location', async (req, res) => {
  try {
    // Extrae la información de ubicación del cuerpo de la solicitud
    const { studentId, latitude, longitude } = req.body;

    // Realiza la inserción en la base de datos
    const result = await pool.query(
      'INSERT INTO ubicaciones_estudiantes (id_estudiante, latitud, longitud) VALUES ($1, $2, $3)',
      [studentId, latitude, longitude]
    );

    // Envía una respuesta exitosa
    res.status(200).send('Ubicación del estudiante registrada correctamente.');
  } catch (error) {
    console.error('Error al procesar la solicitud de ubicación:', error);
    // Envía una respuesta de error
    res.status(500).send('Error interno del servidor.');
  }
});

// asiatencia 
//Funcion para el llamado de Base de datos implementacion asistencia
const registerAttendance = async (childId, attendance, setAttendance, setShowConfirmation) => {
  try {
      const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
     
      // Obtener el tutor asociado al estudiante
      const tutorId = await getTutorIdForStudent(childId);

      console.log('Realizando solicitud al servidor...');
      const response = await fetch('http://localhost:3001/api/attendance', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tutorId, studentId: childId, attendance, dateTime }),
      });

      if (response.ok) {
          const data = await response.json();
          console.log('Respuesta del servidor:', data.message);
          // Actualizar el estado del componente, si es necesario
          if (setAttendance) {
              setAttendance(attendance);
          }
          if (setShowConfirmation) {
              setShowConfirmation(true);
          }
      } else {
          console.error('Error al registrar la asistencia:', response.statusText);
      }
  } catch (error) {
      console.error('Error al registrar la asistencia:', error);
      // Manejar el error, mostrar mensajes, etc.
  }
};


const handleAttendance = async (value) => {
  try {
      console.log('Manejando la asistencia con valor:', value);
      // Llama a la función para registrar la asistencia en la base de datos
      await registerAttendance('uniqueChildId', value, setAttendance, setShowConfirmation); // Cambié 'uniqueChildId' a childId si es necesario
      console.log('Asistencia registrada con éxito');
      // Aquí puedes realizar cualquier acción adicional después de que la asistencia se haya registrado correctamente.
  } catch (error) {
      console.error('Error al manejar la asistencia:', error);
      // Aquí puedes realizar acciones específicas en caso de error, como mostrar un mensaje al usuario.
  }
};

app.post("/api/attendance", async (req, res) => {
  try {
    const { student_id, attendance, dateTime } = req.body;


    // Verifica que childId y attendance estén presentes en la solicitud
    if (!childId || !attendance) {
      return res.status(400).json({ error: "childId y attendance son obligatorios." });
    }

    // Verifica la existencia del estudiante en la base de datos
    const studentExists = await db("students").where({ student_id: childId }).first();

    if (!studentExists) {
      return res.status(400).json({ error: `El estudiante con ID ${childId} no existe.` });
    }
    // Realiza la inserción en la base de datos
    const result = await db("asistencia").insert({
      student_id: childId,
      presente: attendance,
      fecha: dateTime,
    }).returning('*');  // Devuelve todas las columnas después de la inserción
    
    if (result.rowCount === 1) {
      const insertedRow = result[0];
      res.status(200).json({ message: "Asistencia registrada con éxito", insertedRow });
    } else {
      res.status(500).json({ error: "Error al registrar la asistencia en la base de datos." });
    }
  } catch (error) {
    console.error("Error al procesar la solicitud de asistencia:", error);
    res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
  }
});

const getTutorIdForStudent = async (studentId) => {
  // Aquí deberías tener la lógica para obtener la ID del tutor asociado al estudiante
  // Puedes hacer una consulta a la base de datos para obtener esta información
  // Reemplaza el siguiente código con la lógica específica de tu aplicación
  const student = await db("students").select("fk_tutor_id").where({ student_id: studentId }).first();
  return student ? student.fk_tutor_id : null;
};







// Ruta para cargar imágenes en Google Cloud Storage
app.post("/upload-profile-picture", verifyToken, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No se encontró el archivo para cargar." });
    }
    /* El ID del tutor se obtiene desde el middleware verifyToken que se ejecuta antes de esta ruta y establece el ID del tutor 
    en el objeto de solicitud, la cual se puede acceder como req.userId.
    Req sería el objeto de solicitud que se pasa a esta ruta como primer parámetro, que viene desde el cliente */
    const tutorId = req.userId;

    const file = req.files.file;
    const fileName = `tutor-profile-${tutorId}-image`;
    const blob = storage.bucket(bucketName).file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      console.error(err);
      res
        .status(500)
        .json({
          message: "Error al cargar la imagen en Google Cloud Storage",
          error: err.message,
        });
    });

    blobStream.on("finish", async () => {

      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

      try {
        // Llama a la función que guarda la URL pública en tu base de datos
        await saveImageURLToDatabase(tutorId, publicUrl);
        res
          .status(200)
          .json({ message: "Imagen cargada con éxito", imageUrl: publicUrl });
      } catch (dbError) {
        console.error(
          "Error al guardar la URL de la imagen en la base de datos:",
          dbError
        );
        res
          .status(500)
          .json({
            message: "Error al guardar la URL de la imagen en la base de datos",
            error: dbError.message,
          });
      }
    });

    blobStream.end(req.files.file.data);
  } catch (error) {
    console.error("Error al cargar la imagen:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
});

// Ruta para obtener la URL firmada de la imagen del perfil del tutor
app.get("/get-tutor-profile-picture", verifyToken, async (req, res) => {
  try {
    const tutorId = req.userId; // Obtiene el ID del tutor de algún lugar, como un token JWT
    const fileName = `tutor-profile-${tutorId}-image`; // Asegúrate de que este nombre coincida con el nombre del archivo al cargarlo
    const file = storage.bucket(bucketName).file(fileName);

    // Verifica si el archivo existe en el bucket antes de intentar obtener una URL firmada
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ message: "La imagen de perfil no existe." });
    }

    // Opciones para la URL firmada
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // URL válida por 15 minutos
    };

    // Obtener la URL firmada
    const [url] = await file.getSignedUrl(options);
    res.status(200).json({ imageUrl: url });

  } catch (error) {
    console.error("Error al obtener la URL firmada:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
});


//configuro socket io para chatting
const io = require("socket.io")(3002, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let connectedUsers = new Map(); // Usar un Map para mantener el seguimiento del usuario y su socket
function limpiarConexiones() {
  console.log("Limpiando conexiones de usuarios...");
  connectedUsers = new Map(); // Reiniciar las conexiones de usuarios
  console.log("Conexiones limpiadas.");
}
io.on("connection", (socket) => {
  socket.on("preconnection",()=>{
     limpiarConexiones(); // Limpia las conexiones al iniciar el servidor
  })
 
});

io.on("connect", (socket) => {

  //Evento en que el usuario se conecta al socket
  socket.on("login", (userId, userType) => {
    connectedUsers.set(userId, { socket, userType }); // Asociar el ID de usuario con el socket Y su tipo(Tutor o conductor)
    if (userType === "conductor") {
      //la sala del conductor, por ejemplo su ID, podría ser la sala en sí
      socket.join(userId);
    } else if (userType === "tutor") {
      //obten el ID del conductor asociado a el tutor ()
      const conductorId = getConductorId(userId);
      socket.join(conductorId);
    }
    const date = new Date();
    const currentTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.log(
      `Usuario ${userId} conectado a las ${currentTime} en el socket del conductor: ${socket}`
    );
  });

  // Unir al usuario a la sala de chat específica
  socket.on("joinChat", (chatRoom) => {
    socket.join(chatRoom);
  });

  socket.on("mensaje", (data) => {
    const { senderId, message, chatRoom } = data;

    if (chatRoom) {
      io.to(chatRoom).emit("mensaje", { senderId, message });
    } else {
      // Manejar el caso cuando no se proporciona una sala
      socket.emit("mensaje", {
        senderId: "Servidor",
        message: "Se requiere un nombre de sala.",
      });
    }
  });
  socket.on("disconnect", () => {
    connectedUsers.forEach((userSocket, user) => {
      if (userSocket === socket) {
        connectedUsers.delete(user);
        const date = new Date();
        const currentTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        console.log(`Usuario ${user} desconectado a las ${currentTime}`);
      }
    });
  });
//console.log("Servidor iniciado y listo para nuevas conexiones");
});


// Asegurarte de cerrar la conexión cuando la aplicación se cierra
process.on("exit", () => {
  if (db) {
    db.destroy();
    console.log("Conexión a la base de datos cerrada.");
  }
});
