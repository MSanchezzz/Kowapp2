"use client"

import Link from 'next/link';
import React from 'react';
import './style/styles.css';

const inicioApp = () => { 
  return (
    <div className='background-login-tutor'>
      <img src="/img/kowappLogo.png"/>
      <div className='index-div-button'>
        <Link href={'/role'} className='registro-button' >Registrarse </Link>
        <Link href={'/login'} className='login-button' >Iniciar sesión</Link>
      </div>
    </div>
  );
};

export default inicioApp;
