"use client"

import React, { useState } from 'react';
import axios from 'axios';
import '../../../style/styles.css';
import Link from 'next/link';
import Head from 'next/head';
import { clear } from 'console';
import { useRouter } from 'next/navigation';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleVerification = async () => {
    try {
      const response = await axios.post('http://localhost:3001/verify-email', {
        email: localStorage.getItem('email'),
        code: code,
      });

      if (response.data.success) {
        // setMessage('Correo electrónico verificado con éxito.'); Comentado para mejorar UX, pero esto debe ir, es parte de la UI
        // Proponer solución para que el usuario pueda ver que se verificó con éxito su correo y luego redirigirlo al login
        // Actualmente lo hace pero es con un alert, lo que es poco atractivo para el usuario
        alert('Correo electrónico verificado con éxito.');
        localStorage.clear();
        router.push('../../../login/');
      } else {
        setMessage('Código inválido o expirado.');
      }
    } catch (error) {
      console.error('Error durante la verificación:', error);
      setMessage('Ocurrió un error durante la verificación.');
    }
  };

  return (
    <div className='background-login-tutor'>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="registration-container-tutor">
        <div className='index-div-button'>
          <Link href={'./'}>Volver</Link>
        </div>

        <h2>Te hemos enviado un código verificador a tu [email]</h2>

        {message && 
          <div className="message-container">
            <p className={message.includes('éxito') ? 'success-message' : 'error-message'}>{message}</p>
          </div>
        }

        <div className="input-field-container">
          <input 
            type="text" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            placeholder="Ingresa tu código de verificación" 
            className="input-verify-email"
          />
        </div>

        <div className='div-button-registro'>
          <button type="button" className='login-button' onClick={handleVerification}>Verificar</button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
