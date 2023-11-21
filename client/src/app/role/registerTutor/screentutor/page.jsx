'use client'
// Importaciones
import Link from 'next/link';
import '../../../style/styles.css';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';

const ScreenTutor = () => {
  // Estado y variables
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

  // Efecto para la ubicación
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

  // Efecto para la carga de datos y el mapa
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/student-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`No autorizado - Estado: ${response.status}`);
        }

        const studentInfo = await response.json();

        if (Array.isArray(studentInfo)) {
          console.log("Type of studentInfo:", typeof studentInfo);
          console.log("Length of studentInfo:", studentInfo.length);
          console.log("Student data from server:", studentInfo);
          setData(studentInfo);
        } else {
          console.error("Invalid studentInfo received from the server:", studentInfo);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setIsSessionExpired(true);
      }
    };

    fetchData();
  }, [token]);

  // Efecto para la carga de la API de Google Maps
  useEffect(() => {
    let script;

    const initMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const mapOptions = {
              center: { lat: position.coords.latitude, lng: position.coords.longitude },
              zoom: 15,
              styles: [
                {
                  featureType: 'all',
                  elementType: 'geometry',
                  stylers: [
                    { visibility: 'simplified' },
                    { hue: '#ff0000' },
                    { saturation: -100 },
                    { lightness: 10 },
                    { gamma: 0.8 }
                  ]
                }
              ],
            };

            const map = new window.google.maps.Map(document.getElementById('map'), {
              ...mapOptions,
              styles: [...mapOptions.styles],
              background: 'transparent',
            });

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

    window.initMap = initMap;

    if (typeof window.google === 'undefined') {
      script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAgI1pg5OLY-CsKJDp7eTALNnA6ZXnkXlE&libraries=places&callback=initMap`;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (script) {
          document.head.removeChild(script);
        }
      };
    }

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Efecto para la obtención de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/student-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`No autorizado - Estado: ${response.status}`);
        }

        const studentInfo = await response.json();

        if (Array.isArray(studentInfo)) {
          console.log("Type of studentInfo:", typeof studentInfo);
          console.log("Length of studentInfo:", studentInfo.length);
          console.log("Student data from server:", studentInfo);
          setData(studentInfo);
        } else {
          console.error("Invalid studentInfo received from the server:", studentInfo);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setIsSessionExpired(true);
      }
    };

    fetchData();
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
  <div id="map" style={{ height: '400px', width: '100%' }}></div>
  return (
    <div>
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