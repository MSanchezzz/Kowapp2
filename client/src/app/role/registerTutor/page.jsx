"use client"

import React, { useState, useEffect } from 'react';
import '../../style/styles.css';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import AutocompleteAddress from "../../../components/AutocompleteAddress"; // Asegúrate de tener la ruta correcta
import Link from 'next/link';

const RegistrationFormTutor = () => {

  const [locationData, setLocationData] = useState({
    residencia: null,
    residenciaEmergencia: null,
    escuela: null,
  });  

  const router = useRouter();

  const handlePlaceSelected = (name, place) => {
    if (place.address_components && place.geometry && place.geometry.location) {
      setFormData({
        ...formData,
        [name]: place.formatted_address,
      });
      setLocationData({
        ...locationData,
        [name]: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      });
      setSubmitted(false);
    }
  };
  
  
  // Función para inicializar el Autocomplete
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    telefonoEmergencia: '',
    contraseña: '',
    repetirContraseña: '',
    nombreNino: '',
    apellidoNino: '',
    residencia: '',
    residenciaEmergencia: '',
    escuela: '',
  });

  const fields = [
    { label: 'Nombre', name: 'nombre', placeholder: 'Ingrese su nombre', type: 'text'},
    { label: 'Apellido', name: 'apellido', placeholder: 'Ingrese su apellido', type: 'text'},
    { label: 'RUT', name: 'rut', placeholder: 'Ej: 12345678-9', type: 'text'},
    { label: 'Correo', name: 'email', placeholder: 'Ingrese su correo', type: 'email'},
    { label: 'Teléfono', name: 'telefono', placeholder: 'Ingrese su telefono', type: 'number'},
    { label: 'Teléfono Emergencia', name: 'telefonoEmergencia', placeholder: 'Ingrese su telefono de emergencia', type: 'number'},
    { label: 'Contraseña', name: 'contraseña', type: 'password', placeholder: 'Debe tener entre 8 y 12 caracteres'},
    { label: 'Repetir Contraseña', name: 'repetirContraseña', type: 'password', placeholder: 'Ingrese la contraseña nuevamente'},
    { label: 'Nombre Estudiante', name: 'nombreNino', placeholder: 'Ingrese el nombre del estudiante', type: 'text'},
    { label: 'Apellido Estudiante', name: 'apellidoNino', placeholder: 'Ingrese el apellido del estudiante', type: 'text'},
    { label: 'Residencia Estudiante', name: 'residencia', placeholder: 'Ingrese la residencia del estudiante', type: 'text'},
    { label: 'Residencia Emergencia', name: 'residenciaEmergencia', placeholder: 'Ingrese la residencia de emergencia', type: 'text'},
    { label: 'Escuela', name: 'escuela', placeholder: 'Ingrese la escuela del estudiante', type: 'text'}
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
        if (fieldRefs[errorField.field] && fieldRefs[errorField.field].current) {
          fieldRefs[errorField.field].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
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
    let errorMessage = '';  // mensaje de error localo

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
    } else if (!formData.nombreNino) {
        isValid = false;
        invalidField = 'nombreNino';
    } else if (!formData.apellidoNino) {
        isValid = false;
        invalidField = 'apellidoNino';
    } else if (!formData.residencia) {
        isValid = false;
        invalidField = 'residencia';
        errorMessage = 'Por favor, ingrese una residencia válida.'
    } else if (formData.residencia === formData.residenciaEmergencia) {
        isValid = false;
        invalidField = 'residenciaEmergencia';
        errorMessage = 'Por favor, ingrese una residencia de emergencia distinta.'
    } else if (!formData.escuela) {
        isValid = false;
        invalidField = 'escuela';
        errorMessage = 'Por favor, ingrese una escuela válida.'
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
            nombreNino: formData.nombreNino,
            apellidoNino: formData.apellidoNino,
            residencia: locationData.residencia,
            residenciaEmergencia: locationData.residenciaEmergencia,
            escuela: locationData.escuela
        };
        console.log('Datos de usuario a enviar:', userData);

        const res = await fetch('http://localhost:3001/insert-tutor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (res.ok) {
            localStorage.setItem('email', formData.email);
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
    <div className='background-register-tutor'>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="form-title-register-tutor">
        <Link href="/role">
          <img src="/img/back.png" className='button-back'/>
        </Link>
        <h1 className='title'>Registro</h1>
      </div>
      <div className="registration-container-tutor">
        <form onSubmit={handleSubmit} className='form-container'>
        {fields.map((field) => (
        <div key={field.name} className=''>
          <label>{field.label}:</label>
          {field.name === "residencia" || field.name === "residenciaEmergencia" || field.name === "escuela" ? (
            <AutocompleteAddress
              placeholder={field.placeholder}
              onPlaceSelected={(place) => handlePlaceSelected(field.name, place)}
            /> // FIN DE AUTOCOMPLETE, SOLO PARA RESIDENCIA Y RESIDENCIA DE EMERGENCIA
          ) : field.name == 'telefono' ? (
            <div className='div-select-pais-number'>
              <select
                className='select-pais-number'
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
                  <small className='error-message-inline'>
                    {errorMessage}
                  </small>
              ) : null}
            </div>
          ))}

          <div className= 'div-button-registro'>
            <button type="submit" className='registro-button'>Registrarse</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationFormTutor;




