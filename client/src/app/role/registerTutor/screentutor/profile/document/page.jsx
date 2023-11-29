"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../../../../style/styles.css';
import { useRouter } from 'next/navigation';
import Modal from '../../../../../../components/SessionExpiredModal';

const DriverLink = () => {
  const predefinedMessages = [
    "Me gustaría obtener su servicio",
    "¿Cuál es su disponibilidad horaria?",
    "Quiero hacer una cotización",
    "Necesito un transporte especializado"
  ];

  const [drivers, setDrivers] = useState([]);
  const router = useRouter();
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(predefinedMessages[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState(null);
  const [isImageVisible, setIsImageVisible] = useState(false);

  const handleSelectMessage = (e) => {
    setSelectedMessage(e.target.value);
  };

  const handleShowImage = (driverId) => {
    setCurrentDriverId(driverId);
    setIsImageVisible(true);
  };

  const handleCloseImage = () => {
    setIsImageVisible(false);
  };

  const closeModalOptions = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetch('http://localhost:3001/list-drivers', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDrivers(data);
        } else {
          console.error("Data from server is not an array:", data);
          setDrivers([]);
          setIsSessionExpired(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setIsSessionExpired(true);
      });
  }, []);

  const closeModal = () => {
    setIsSessionExpired(false);
    router.push('../../../../../login');
  };

  const handleAddRequest = () => {
    if (!currentDriverId) return;
    const status = 0;

    fetch('http://localhost:3001/create-request', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        driverId: currentDriverId,
        status,
        message: selectedMessage
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Solicitud enviada');
          closeModalOptions();
        } else {
          alert('Error al enviar la solicitud.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='search-driver-page'>
      <div className='search-driver-header'>
        <div className='search-driver-options'>
          <Link href={'/role/registerTutor/screentutor/profile/driverlink'}>
            <img src="/img/back.png" alt="Volver" className="back-icon" />
          </Link>
        </div>
        <div>
          <h1 className='Title-page-driverlink'>Documentacion conductores</h1>
        </div>
        <div className='search-driver-filters'></div>
      </div>
      <div className='search-driver-list'>
        {drivers.map((driver, index) => (
          <div
            key={driver.driver_id}
            className='search-driver-item'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img src="/img/profile.png" alt="Driver Avatar" className="driver-avatar" />
            <div className='search-driver-info-container'>
              <p className='search-driver-name-driver'>{driver.driver_name + " " + driver.driver_surname}</p>
              <p className='search-driver-info-item'>{driver.driver_email}</p>
              <p className='search-driver-info-item'>{driver.contact_number}</p>
            </div>
            <img src="/img/add-user.png" alt="Agregar" className="add-icon" onClick={() => handleShowImage(driver.driver_id)} />
          </div>
        ))}
      </div>
      {isImageVisible && (
        <div className='modal'>
          <div className='modal-content'>
            <img src="/img/documento.png" />
            <button onClick={handleCloseImage}>Cerrar Imagen</button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <select value={selectedMessage} onChange={handleSelectMessage}>
              {predefinedMessages.map((message, index) => (
                <option key={index} value={message}>{message}</option>
              ))}
            </select>
            <button onClick={handleAddRequest}>Enviar Solicitud</button>
            <button onClick={closeModalOptions}>Cerrar</button>
          </div>
        </div>
      )}
      <div className='search-driver-list-qr-button-div'>
        <Link href='/role/registerTutor/screentutor/profile'>
          <button className='search-driver-list-qr-button'>Home</button>
          <img className='qr-scan-image' src="/img/qr-scan.png" alt="QR" />
        </Link>
      </div>
    </div>
  );
};

export default DriverLink;
