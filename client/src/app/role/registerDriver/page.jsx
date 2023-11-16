//client/src/app/role/registerDriver/page.jsx

"use client"

import React, { useState, useEffect } from 'react';
import '../../style/styles.css';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

const RegistrationFormDriver = () => {

  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    telefonoEmergencia: '',
    contraseña: '',
    repetirContraseña: '',
    residencia: '',
    modeloVehiculo: '',
    patenteVehiculo: '',
    capacidadVehiculo: '',
  });

  const fields = [
    { label: 'Nombre', name: 'nombre', placeholder: 'Ingrese su nombre', type: 'text' },
    { label: 'Apellido', name: 'apellido', placeholder: 'Ingrese su apellido', type: 'text' },
    { label: 'RUT', name: 'rut', placeholder: 'Ej: 12345678-9', type: 'text' },
    { label: 'Correo', name: 'email', placeholder: 'Ingrese su correo', type: 'email' },
    { label: 'Teléfono', name: 'telefono', placeholder: 'Ingrese su telefono', type: 'number' },
    { label: 'Teléfono Emergencia', name: 'telefonoEmergencia', placeholder: 'Ingrese su telefono de emergencia', type: 'number' },
    { label: 'Contraseña', name: 'contraseña', type: 'password', placeholder: 'Debe tener entre 8 y 12 caracteres' },
    { label: 'Repetir Contraseña', name: 'repetirContraseña', type: 'password', placeholder: 'Ingrese la contraseña nuevamente' },
    { label: 'Residencia Estudiante', name: 'residencia', placeholder: 'Ingrese la residencia del estudiante', type: 'text'},
    { label: 'Modelo Vehículo', name: 'modeloVehiculo', placeholder: 'Ingrese el modelo de su vehículo', type: 'text' },
    { label: 'Patente Vehículo', name: 'patenteVehiculo', placeholder: 'Ej: AB1234 o ABCD12', type: 'text' },
    { label: 'Capacidad Vehículo', name: 'capacidadVehiculo', placeholder: 'Ingrese la capacidad de su vehículo', type: 'number' },
  ];

  const fieldRefs = fields.reduce((acc, field) => {
    acc[field.name] = React.createRef();
    return acc;
  }, {});

  const validaRUT = (rutCompleto) => {
    if (!/^0*(\d{1,3}(\.?\d{3})*)\-?([\dkK])$/.test(rutCompleto)) return false;
    const tmp = rutCompleto.split('-');
    let digv = tmp[1];
    const rut = tmp[0].replace(/\./g, '');
    if (digv === 'K') digv = 'k';
    return dv(rut) === digv;
  };

  // Código para validar el dígito verificador
  const dv = (T) => {
    let M = 0,
      S = 1;
    for (; T; T = Math.floor(T / 10))
      S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? `${S - 1}` : 'k';
  };
  const validaPatenteVehiculo = (patente) => {
    const patenteRegex = /^[A-Z]{2}\d{4}$|^[A-Z]{4}\d{2}$/;
    return patenteRegex.test(patente);
  };

  const [errorMessage, setErrorMessage] = useState('');

  const [phonePrefix, setPhonePrefix] = useState('+56'); // Por defecto para Chile

  const handleChange = (e) => { // Función para actualizar el estado con los datos del formulario
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setSubmitted(false); // Restablece a false cuando el usuario escribe algo
  };

  const [errorField, setErrorField] = useState(null); // Estado para saber si hay un campo con error
  // Observa los cambios en errorField y actúa en consecuencia
  useEffect(() => {
    if (errorField && errorField.field) {
        setTimeout(() => {
          fieldRefs[errorField.field].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);  // Añade una demora de 100ms
    }
  }, [errorField]);

  const [submitted, setSubmitted] = useState(false); // Estado para saber si el formulario fue enviado

  const emailExample = 'Ejemplo: usuario@dominio.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Cambia a true cuando el usuario hace click en el botón de submit
    const emailPattern = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; 

    let isValid = true;
    let invalidField = '';
    let errorMessage = '';  // Nuevo: mensaje de error localo

    if (!formData.nombre) {
        isValid = false;
        invalidField = 'nombre';
        errorMessage = 'Por favor, ingrese un nombre válido.'
    } else if (!formData.apellido) {
        isValid = false;
        invalidField = 'apellido';
        errorMessage = 'Por favor, ingrese un apellido válido.'
    } else if (!formData.email.match(emailPattern)) {
        isValid = false;
        invalidField = 'email';
        errorMessage = 'Por favor, ingrese un correo válido.'
    } else if (!validaRUT(formData.rut)) {
        isValid = false;
        invalidField = 'rut';
        errorMessage = 'Por favor, ingrese un RUT válido.'
    } else if (!((phonePrefix === '+56' && formData.telefono.length === 9 && formData.telefono.startsWith('9')) 
              || (phonePrefix === '+53' && formData.telefono.length === 8))) {
        isValid = false;
        invalidField = 'telefono';
        errorMessage = 'Por favor, ingrese un teléfono válido.'
    } else if (formData.telefono === formData.telefonoEmergencia || formData.telefonoEmergencia.length !== 9
           || !formData.telefonoEmergencia.startsWith('9')) {
        isValid = false;
        invalidField = 'telefonoEmergencia';
        errorMessage = 'Por favor, ingrese un teléfono de emergencia válido.'
    } else if (formData.contraseña.length < 8 || formData.contraseña.length > 12) {
        isValid = false;
        invalidField = 'contraseña';
        errorMessage = 'Por favor, ingrese una contraseña válida.'

        // Borra la contraseña y repetirContraseña del estado
        setFormData(prevState => ({ 
          ...prevState,
          contraseña: '',
          repetirContraseña: ''
        }));

    } else if (formData.contraseña !== formData.repetirContraseña) {
        isValid = false;
        invalidField = 'repetirContraseña';
        errorMessage = 'Las contraseñas no coinciden.'
    } else if (!formData.residencia) {
        isValid = false;
        invalidField = 'residencia';
        errorMessage = 'Por favor, ingrese una residencia válida.'
    } else if (!formData.modeloVehiculo) {
        isValid = false;
        invalidField = 'modeloVehiculo';
        errorMessage = 'Por favor, ingrese un modelo de Vehiculo.'
    } else if (!validaPatenteVehiculo(formData.patenteVehiculo)) {
      isValid = false;
      invalidField = 'patenteVehiculo';
      errorMessage = 'Por favor, ingrese una patente válida.'
    } else if (!formData.capacidadVehiculo) {
      isValid = false;
      invalidField = 'capacidadVehiculo';
      errorMessage = 'Por favor, ingrese capacidad.'
    }
    if (!isValid) {
      setErrorField({ field: invalidField, id: new Date().getTime() });
      setErrorMessage(errorMessage);
      return;
  }
    setSubmitted(false);

    try {
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        rut: formData.rut,
        email: formData.email,
        telefono: formData.telefono,
        telefonoEmergencia: formData.telefonoEmergencia,
        contraseña: formData.contraseña,
        repetirContraseña: formData.repetirContraseña,
        residencia: formData.residencia,
        modeloVehiculo: formData.modeloVehiculo,
        patenteVehiculo: formData.patenteVehiculo,
        capacidadVehiculo: formData.capacidadVehiculo,
      }
      console.log('Datos de usuario a enviar:', userData);

        const res = await fetch('http://localhost:3001/insert-tutor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (res.ok) {
            const data = await res.json();
            alert(data.message);
            router.push('./registerTutor/sendEmail');
        } else {
          const errorData = await res.json();
          console.log("Error data from server:", errorData);
          setErrorField({ field: errorData.duplicateField, id: new Date().getTime() });  // Resaltará el campo específico
          setErrorMessage(errorData.message);      // Mostrará el mensaje de error del servidor
          setSubmitted(true);
        }
    } catch (error) {
        console.error(error);
    }
};
  return (
    <div className="background-register-driver">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="form-title-register-driver">
        <Link href="/role">
          <img src="/img/back.png" className='button-back'/>
        </Link>
        <h1 className='title'>Registro</h1>
      </div>
      <div className="registration-container-driver">
        <form onSubmit={handleSubmit} className="form-container">
          {fields.map((field) => (
            <div key={field.name} className="">
              <label>{field.label}:</label>
              {field.name === 'telefono' ? (
                <div className="div-select-pais-number">
                  <select
                    className="select-pais-number"
                    name="phonePrefix"
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                  >
                    <option value="+56">Chile (+56)</option>
                    <option value="+53">Cuba (+53)</option>
                  </select>
                  <input
                    ref={fieldRefs[field.name]}
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={submitted && errorField && errorField.field === field.name ? 'error' : ''}
                  />
                </div>
              ) : (
                <input
                  ref={fieldRefs[field.name]}
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={submitted && errorField && errorField.field === field.name ? 'error' : ''}
                  autoComplete={field.name === 'contraseña' || field.name === 'repetirContraseña' ? 'off' : 'on'}
                />
              )}
              {submitted && errorField && errorField.field === field.name ? (
                <small className="error-message-inline">
                  {errorMessage}
                </small>
              ) : null}
            </div>
          ))}
          <div className="div-button-registro">
            <button type="submit" className="registro-button">Registrarse</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationFormDriver;
