// src/app/role/registerTutor/screentutor/page.jsx
'use client'

import Link from 'next/link';
import '../../../style/styles.css';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation'; 
import Modal from '../../../../components/SessionExpiredModal'; 

const ScreenTutor = () => {
  const [data, setData] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const router = useRouter();
  const socket = io("http://localhost:3002");

  useEffect(() => {
    fetch('http://localhost:3001/screen-tutor', {
      method: 'GET',
      credentials: 'include', // Asegúrate de incluir credenciales para que las cookies se envíen
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error("Data from server is not an array:", data);
          setData([]);  
          setIsSessionExpired(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setIsSessionExpired(true);
      });
  }, []);

  const handleConnection = () => {
    socket.emit("preconnection");
    console.log("Preconexión...");
  };

  const closeModal = () => {
    setIsSessionExpired(false);
    router.push('/login');
  };

  return (
    <div className="background-screen-tutor">
      {/* Encabezado con iconos */}
      <div className="header-icons">
        <div className='icon-settings'>
          <Link href='/role/registerTutor/screentutor/profile'>
            <img src="/img/ajustes.png" alt="Configuración" />
          </Link>
        </div>
      </div>

      {/* Añadir aquí el componente de mapa y la lógica asociada */}
      <div className="map-container">
        {/* Mapa y detalles del trayecto */}
      </div>

      {/* Barra de navegación inferior con información de usuario e íconos */}
      <div className="nav-bar">
          <span className="user-name">Sofía Alejandra Lopez Gonzalez</span>
          <img src="/img/profile.png" alt="Foto de perfil" className="profile-pic" />
        <div className="profile-section">
          <div className="user-details">
            <span className="user-info-detail">Abordó: 08:00</span>
            <span className="user-info-detail">Llegada: 08:32</span>
            <span className="user-info-detail">Distancia: 9.2 km</span>
          </div>
        </div>
        <div className="user-action-buttons">
          {/* Botón de Seguimiento */}
          <div className="nav-button" onClick={handleConnection}>
            <img src="/img/logokow.png" alt="Seguimiento" className="nav-icon"/>
            <div className="nav-button-text">Seguimiento</div>
          </div>

          {/* Botón de Asistencia */}
          <div className="nav-button">
             <Link href='/role/registerTutor/screentutor/asist'>
               <img src="/img/mochila.png" alt="Asistencia" className="nav-icon"/>
               </Link>
            <div className="nav-button-text">Asistencia</div>
          </div>

          {/* Botón de Notificaciones */}
          <div className="nav-button">
            <Link href='/role/registerTutor/screentutor/notification'>
              <img src="/img/puntos-de-comentario.png" alt="Notificaciones" className="nav-icon"/>
            </Link>
            <div className="nav-button-text">Chatt</div>
          </div>
        </div>
      </div>
      <Modal isOpen={isSessionExpired} onRequestClose={closeModal} />
    </div>
  );
};

export default ScreenTutor;
