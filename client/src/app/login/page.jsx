// src/app/login/page.jsx

"use client"

import React, { useState, useEffect } from 'react';
import '../style/styles.css';
import { useRouter } from 'next/navigation'; // Ajuste en la importación

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Verificar la sesión cuando el componente se monta
  useEffect(() => {
    fetch('http://localhost:3001/check-session', {
      credentials: 'include' // para incluir la cookie HttpOnly
    })
    .then(response => {
      if (response.ok) {
        // Si la sesión es válida, redirigir a screentutor
        router.push('/role/registerTutor/screentutor');
      } else {
        throw new Error('No autenticado');
      }
    })
    .catch(error => {
      // No autenticado o error al comprobar la sesión, el usuario puede intentar iniciar sesión
      console.log(error);
    });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Los campos deben ser llenados.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contraseña: password }),
        credentials: 'include', // Asegúrate de incluir credenciales para que las cookies se envíen
      });

      if (response.ok) {
        // No necesitas almacenar el token en localStorage
        router.push('/role/registerTutor/screentutor');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('Ha ocurrido un error al iniciar sesión.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='background-login-tutor'>
      <div>
        <img title='Kowapp'src='/img/kowappLogo.png'/>
      </div>
      <div className='form-login'>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Correo electrónico:</label>
            <input type='text' title='Ingresa tu email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Contraseña:</label>
            <input type='password' title='Ingresa tu contraseña' value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className='div-button-login'>
            <button type='submit' className='login-button' disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
      {error && <div className='error-message'>{error}</div>}
    </div>
  );
};

export default LoginForm;
