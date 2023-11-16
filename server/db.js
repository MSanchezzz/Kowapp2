// server/db.js
const nodemailer = require('nodemailer'); // Módulo para enviar correos electrónicos
const dotenv = require('dotenv'); // Módulo para cargar variables de entorno desde un archivo .env
const Knex = require('knex'); // Módulo para conectarse a la base de datos
const { getSecrets } = require('./secrets'); // Importa la función getSecrets desde el mismo directorio
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { request, response } = require('express');


dotenv.config(); // Cargar variables de entorno desde el archivo .env

// Declaración de db en el ámbito global del módulo
let db;

// Define una función para crear una conexión a la base de datos
const createTcpPool = async () => {
  try {
    // Obtener secretos de Cloud Secret Manager
    const secretNames = [
      'projects/116591088112/secrets/db_user', 
      'projects/116591088112/secrets/db_password',
      'projects/116591088112/secrets/db_host',
      'projects/116591088112/secrets/db_port',
      'projects/116591088112/secrets/db_name',
      'projects/116591088112/secrets/node_port',
      'projects/116591088112/secrets/client-cert',
      'projects/116591088112/secrets/client-key',
      'projects/116591088112/secrets/server-ca',
    ];

    const secrets = await getSecrets(secretNames);

    // Configuración de la base de datos
    const dbConfig = {
      client: 'pg',
      connection: {
        user: secrets['projects/116591088112/secrets/db_user'],
        password: secrets['projects/116591088112/secrets/db_password'],
        host: secrets['projects/116591088112/secrets/db_host'],
        port: secrets['projects/116591088112/secrets/db_port'],
        database: secrets['projects/116591088112/secrets/db_name'],
      },
    };

    // Si se especifica una ruta para el certificado de CA, utiliza SSL
    if (process.env.DB_ROOT_CERT) {
      dbConfig.connection.ssl = {
        rejectUnauthorized: false,
        ca: secrets['projects/116591088112/secrets/server-ca'],
        key: secrets['projects/116591088112/secrets/client-key'],
        cert: secrets['projects/116591088112/secrets/client-cert'],
      };
    }

    // Asignar la conexión a la variable db
    db = Knex(dbConfig); // Knex para crear la conexión a la base de datos con la configuración anterior
    return db; // Devuelve la conexión
  } catch (error) {
    console.error('Error al crear la conexión a la base de datos:', error);
    throw error; // Reenviar el error para que sea manejado en otro lugar si es necesario
  }
};


// Define una función para insertar un conductor en la tabla "drivers"
const insertDriver = async (nombre, apellido, rut, email, telefono, telefonoEmergencia, contraseña, modeloVehiculo, patenteVehiculo, capacidadVehiculo) => {
  try {
    // Inserta al nuevo conductor en la tabla "drivers"
    const newDriver = await db('drivers').insert({
      driver_name: nombre,
      driver_surnames: apellido,
      dni_number: rut,
      driver_email: email,
      cellphone_number: telefono,
      emergency_cellphone_number: telefonoEmergencia,
      passwrd: contraseña,
      vehicle_model: modeloVehiculo,
      vehicle_license: patenteVehiculo,
      vehicle_capacity: capacidadVehiculo,
    });

    return newDriver; // Devuelve los detalles del conductor insertado (opcional)
  } catch (error) {
    console.error('Error al insertar el conductor:', error);
    throw error;
  }
};

// Define una función para insertar un conductor en la tabla "tutor"
const insertTutor = async (
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
  escuela
) => {
  try {
    const verificationCode = Math.floor(Math.random() * 1000000); // Genera un código aleatorio
    const existingTutorRut = await db('tutors').whereIn('rut', [rut]).first();
    const existingTutorEmail = await db('tutors').whereIn('email', [email]).first();
    const existingTutorNumber = await db('tutors').whereIn('number', [telefono]).first();
    //console.log("existingTutorNumber:", existingTutorNumber);
  
  if (existingTutorRut && existingTutorRut.rut === rut) { // Si el tutor ya existe, lanza un error
    throw { message: 'El RUT ingresado ha sido registrado anteriormente', field: 'rut' };
  } else if (existingTutorNumber && String(existingTutorNumber.number) === String(telefono)) {
    throw { message: 'El número ingresado ha sido registrado anteriormente', field: 'telefono' };
  } else if (existingTutorEmail && existingTutorEmail.email === email) {
    throw { message: 'El correo ingresado ha sido registrado anteriormente', field: 'email' };
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const newtutor = await db('tutors').insert({ // Inserta al nuevo tutor en la tabla "tutors"
      names: nombre,
      surnames: apellido,
      rut: rut,
      email: email,
      number: telefono,
      emergency_contact_number: telefonoEmergencia,
      password: hashedPassword,
      address: residencia,
      emergency_address: residenciaEmergencia,
    });
    await db('verification_codes').insert({
      email: email,
      code: verificationCode,
      expiry_date: new Date(Date.now() + 3 * 60 * 1000) // Establece una fecha de expiración para el código de 10 minutos desde ahora
    });

    // Envía el correo electrónico de verificación
    await sendVerificationEmail(email, verificationCode);

    return newtutor; // Devuelve los detalles del tutor insertado (opcional)
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const loginTutor = async (email, contraseña) => {
  try {
    const tutor = await db('tutors').where({ email }).first();

    if (!tutor) {
      // Si no se encuentra el tutor, devuelve un error
      throw new Error('Correo electrónico incorrecto');
    }

    // Compara la contraseña ingresada con la hasheada almacenada
    const isMatch = await bcrypt.compare(contraseña, tutor.password);
    if (!isMatch) {
      // Si la contraseña no coincide, devuelve un error
      throw new Error('Contraseña incorrecta');
    }

    // Devuelve los datos del tutor, incluido el id
    return tutor;
  } catch (error) {
    throw error;
  }
};


// Función para marcar todas las sesiones anteriores del tutor como inactivas
const deactivateOldSessions = async (tutor_id ) => {
  // Verifica primero si hay sesiones activas
  const activeSessions = await db('tutors_sessions')
                                .where({ tutor_id, is_active: true })
                                .first()
                                .orderBy('created_at', 'desc')
                                .select('session_id'); 

  if (!activeSessions || activeSessions.length === 0) {
    await db('tutors_sessions')
          .where({ tutor_id, is_active: true })
          .update({ is_active: false });
  }
};



// Función para crear una nueva sesión
const createSession = async (tutor_id) => {
  await db('tutors_sessions').insert({ tutor_id });
    const token = jwt.sign({ id: tutor_id }, 'eZF6849:P%%MiCXu00W2', { expiresIn: '2h' });
  return token;
};


// Función para enviar un correo electrónico de verificación
const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tester.kowapp@gmail.com',
      pass: 'nsbd yosi msxf wmln'
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verifica tu Correo Electrónico',
    text: `Tu código de verificación es: ${code}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de verificación enviado');
  } catch (error) {
    console.error('Error al enviar el correo de verificación:', error);
  }
};

// Define una función para listar los conductores
const listDrivers = async () => {
  try {
    const drivers = await db('drivers').select('*');
    return drivers;
  } catch (error) {
    console.error('Error al obtener los conductores:', error);
    throw error;
  }
};

// Función para listar los estudiantes de un tutor específico
const listStudents = async (tutorId) => {
  try {
    const students = await db('students')
      .where({ fk_tutor_id: tutorId })
      .select('*');
    return students;
  } catch (error) {
    console.error('Error al obtener los estudiantes para el tutor:', error);
    throw error;
  }
};

// Función para crear una solicitud
const createRequest = async (tutorId, driverId, status, message) => {
  try {
    const [requestId] = await db('requests').insert({
      tutor_id: tutorId,
      driver_id: driverId,
      status: status,
      message: message
    }).returning('request_id');
    return requestId;
  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    throw error;
  }
};

const saveImageURLToDatabase = async (tutorId, imageUrl) => {
  try {
    // Actualiza el tutor con la nueva URL de la imagen del perfil
    await db('tutors')
      .where('id', tutorId) // Busca el tutor con el ID especificado
      .update({
        profile_image_url: imageUrl
      });

    console.log(`Imagen del perfil actualizada para el tutor con ID: ${tutorId}`);
  } catch (error) {
    console.error('Error al guardar la URL de la imagen en la base de datos:', error);
    throw error; 
  }
};

// Función para obtener detalles de un tutor específico
const getTutorDetails = async (tutorId) => {
  try {
    const tutorDetails = await db('tutors').where('id', tutorId).first();
    return tutorDetails;
  } catch (error) {
    console.error('Error al obtener detalles del tutor:', error);
    throw error;
  }
};

// Función para insertar un nuevo estudiante en la tabla "students"
const insertStudent = async (studentData, tutorId) => {
  try {
    const {
      student_nombre,
      student_surname,
      rut,
      student_school,
      student_home,
      // Añade más campos si son necesarios
    } = studentData;

    const [newStudentId] = await db('students').insert({
      student_nombre,
      student_surname,
      rut,
      student_school,
      student_home,
      fk_tutor_id: tutorId,
    }).returning('student_id');
    console.log(tutorId)

    return newStudentId;
  } catch (error) {
    console.error('Error al insertar el estudiante:', error);
    throw error;
  }
};

// Función para verificar si un estudiante con un RUT específico ya existe
const checkRutExists = async (rut) => {
  try {
    // Busca un estudiante con el RUT dado
    const existingStudent = await db('students').where({ rut }).first();

    // Si existe un estudiante con ese RUT, retorna true, de lo contrario, false
    return existingStudent ? true : false;
  } catch (error) {
    console.error('Error al verificar si el RUT existe:', error);
    throw error;
  }
};

module.exports = {
  createTcpPool,
  insertDriver, // Agrega la función a las exportaciones
  loginTutor, // Agrega la función para autenticar al usuario tutor
  insertTutor, // Agrega la función tutor
  listDrivers, // Agrega la función para listar conductores
  createRequest, // Agrega la función para crear una solicitud
  deactivateOldSessions, // Agrega la función para marcar todas las sesiones anteriores del tutor como inactivas
  createSession, // Agrega la función para crear una nueva sesión
  saveImageURLToDatabase, // Agrega la función para guardar la URL de la imagen en la base de datos
  getTutorDetails, // Agrega la función para obtener detalles de un tutor específico
  listStudents, // Agrega la función para listar estudiantes
  insertStudent, // Agrega la nueva función a las exportaciones
  checkRutExists, // Agrega la función para verificar si un estudiante con un RUT específico ya existe
};


