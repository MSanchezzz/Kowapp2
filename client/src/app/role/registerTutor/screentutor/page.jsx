'use client';

import Link from 'next/link';
import '../../../style/styles.css';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import Modal from '../../../../components/SessionExpiredModal';

const ScreenTutor = () => {
  const [data, setData] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const router = useRouter();
  const socket = io("http://localhost:3002");

  const getCookie = (name) => {
    if (typeof document === 'undefined') {
      return null;
    }

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  const token = getCookie('token');

  useEffect(() => {
    const handleLocationUpdate = (position) => {
      const { latitude, longitude } = position.coords;
      console.log('Ubicación actualizada:', latitude, longitude);
      setUserLocation({ latitude, longitude });
      // Realiza acciones con la ubicación actualizada, si es necesario
    };

    const handleLocationError = (error) => {
      console.error('Error al obtener la ubicación:', error);
      // Agrega lógica de manejo de errores según tus necesidades
    };

    if (typeof window !== 'undefined') {
      const watchId = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        handleLocationError
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/student-info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`No autorizado - Estado: ${response.status}`);
        }
      })
      .then(studentInfo => {
        if (studentInfo && studentInfo.length !== undefined) {
          console.log("Type of studentInfo:", typeof studentInfo);
          console.log("Length of studentInfo:", studentInfo.length);
          console.log("Student data from server:", studentInfo);
          setData(studentInfo);
        } else {
          console.error("Invalid studentInfo received from the server:", studentInfo);
        }
      })
      .catch(error => {
        console.error('Error fetching student data:', error);
        setIsSessionExpired(true);
      });

    // Función para inicializar el mapa
    const initMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const mapOptions = {
              center: { lat: position.coords.latitude, lng: position.coords.longitude },
              zoom: 15,
            };
            const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);
            new window.google.maps.Marker({
              position: { lat: position.coords.latitude, lng: position.coords.longitude },
              map: map,
              title: '¡Estás aquí!',
            });
          },
          (error) => {
            console.error('Error al obtener la ubicación:', error);
          }
        );
      } else {
        console.error('La geolocalización no es compatible con este navegador.');
      }
    };

    // Llama a la función de inicialización cuando la API de Google Maps se carga
    window.initMap = initMap;

    // Carga dinámicamente la API de Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAgI1pg5OLY-CsKJDp7eTALNnA6ZXnkXlE&libraries=places&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Limpia el script cuando el componente se desmonta
      document.head.removeChild(script);
    };
  }, [token]);

  const handleConnection = () => {
    try {
      socket.emit("preconnection");
      console.log("Preconexión...");
    } catch (error) {
      console.error('Error during preconnection:', error);
      // Agrega lógica de manejo de errores según tus necesidades
    }
  };

  const closeModal = () => {
    setIsSessionExpired(false);
    router.push('/login');
  };


  if (!data) {
    return <div>Loading...</div>;
  }



  return (
    <div>
      {/* Contenedor del mapa con margen superior */}
      <div id="map" style={{ height: "600px", width: "400px", margin: "100px auto" }}></div>
      {/* Resto del contenido de tu componente */}
      <div className="background-screen-tutor">
        <div className="header-icons">
          <div className='icon-settings'>
            <Link href='/role/registerTutor/screentutor/profile'>
              <img src="/img/ajustes.png" alt="Configuración" />
            </Link>
          </div>
        </div>

        <div className="nav-bar">
          <span className="user-name">{data.length > 0 ? `${data[0].name} ${data[0].surname}` : ''}</span>
          <img src="/img/profile.png" alt="Foto de perfil" className="profile-pic" />
          <div className="profile-section">
            <div className="user-details">
              <span className="user-info-detail">Abordó: 08:00</span>
              <span className="user-info-detail">Llegada: 08:32</span>
              <span className="user-info-detail">Distancia: 9.2 km</span>
            </div>
          </div>
          <div className="user-action-buttons">
            <div className="nav-button" onClick={handleConnection}>
              <img src="/img/logokow.png" alt="Seguimiento" className="nav-icon" />
              <div className="nav-button-text">Seguimiento</div>
            </div>
            <div className="nav-button" onClick={() => console.log(userLocation && userLocation.latitude, userLocation && userLocation.longitude)}>
              <img src="/img/logokow.png" alt="Ubicación" className="nav-icon" />
              <div className="nav-button-text">Obtener Ubicación</div>
            </div>
            <div className="nav-button">
              <Link href='/role/registerTutor/screentutor/asist'>
                <div className="nav-button">
                  <img src="/img/mochila.png" alt="Asistencia" className="nav-icon" />
                  <div className="nav-button-text">Asistencia</div>
                </div>
              </Link>
            </div>
            <div className="nav-button">
              <Link href='/role/registerTutor/screentutor/notification'>
                <div className="nav-button">
                  <img src="/img/puntos-de-comentario.png" alt="Notificaciones" className="nav-icon" />
                  <div className="nav-button-text">Chatt</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenTutor;