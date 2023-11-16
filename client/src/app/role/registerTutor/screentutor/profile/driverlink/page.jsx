"use client"

import React, { useState, useEffect, useContext} from 'react';
import Link from 'next/link';
import '../../../../../style/styles.css';
import { useRouter } from 'next/navigation'; // Ajuste en la importación
import Modal from '../../../../../../components/SessionExpiredModal'; // Asegúrate de importar el componente de modal

const DriverLink = () => {

    // Lista de mensajes predefinidos para el dropdown de opciones de mensaje de solicitud
    const predefinedMessages = [
        "Me gustaría obtener su servicio",
        "¿Cuál es su disponibilidad horaria?",
        "Quiero hacer una cotización",
        "Necesito un tranporte especializado"
    ];

    // Esta función ayuda a obtener la lista de conductores desde el servidor
    const [drivers, setDrivers] = useState([]);
    const router = useRouter();  // Declara el router
    const [isSessionExpired, setIsSessionExpired] = useState(false); // estado para controlar el modal de sesión expirada
    const [selectedMessage, setSelectedMessage] = useState(predefinedMessages[0]); // Define el primer mensaje como el valor predeterminado
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para la visibilidad del modal de opciones
    const [currentDriverId, setCurrentDriverId] = useState(null); // estado para el ID del conductor seleccionado en la lista
    
    // Esta función se ejecuta cuando el usuario selecciona un mensaje del dropdown
    const handleSelectMessage = (e) => {
        setSelectedMessage(e.target.value);
    };
    
    // Esta función se ejecuta cuando el usuario presiona el botón de añadir
    const openModal = (driverId) => {
        setCurrentDriverId(driverId);
        setSelectedMessage(predefinedMessages[0]); // Reinicia el mensaje seleccionado al valor predeterminado
        setIsModalOpen(true);
    };

    // Esta función se ejecuta cuando el usuario presiona el botón de cerrar en el modal de opciones de mensaje de solicitud
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
                setDrivers(data)
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

    // Función para cerrar el modal
    const closeModal = () => {
        setIsSessionExpired(false);
        router.push('../../../../../login'); // Redirige al usuario al inicio de sesión
    };
    
    // Esta función debe ser llamada cuando el usuario presione el la imagen de añadir
    const handleAddRequest = () => {
        if (!currentDriverId) return; // Verifica si se ha seleccionado un driverId
        const status = 0; // 0: pendiente, 1: aceptado, 2: rechazado

        fetch('http://localhost:3001/create-request', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                driverId: currentDriverId, // Usa currentDriverId del estado
                status,
                message: selectedMessage // El mensaje seleccionado del dropdown
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Solicitud enviada');
                closeModalOptions(); // Cierra el modal después de enviar la solicitud
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
                    <Link href={'/role/registerTutor/screentutor/profile'}>
                        <img src="/img/back.png" alt="Volver" className="back-icon"/>
                    </Link>
                </div>
                <div>
                    <h1 className='Title-page-driverlink'>Conductores disponibles</h1>
                </div>
                <div className='search-driver-filters'>
                </div>
            </div>  
            <div className='search-driver-list'>
                {drivers.map((driver, index) => (
                    <div 
                        key={driver.driver_id} 
                        className='search-driver-item' 
                        style={{animationDelay: `${index * 0.1}s`}}
                    >
                        <img src="/img/profile.png" alt="Driver Avatar" className="driver-avatar"/>
                        <div className='search-driver-info-container'>
                            <p className='search-driver-name-driver'>{driver.driver_name + " " + driver.driver_surname}</p>
                            <p className='search-driver-info-item'>{driver.driver_email}</p>
                            <p className='search-driver-info-item'>{driver.contact_number}</p>
                        </div>
                        <img src="/img/add-user.png" alt="Agregar" className="add-icon" onClick={() => openModal(driver.driver_id)}/>
                    </div>
                ))}
            </div>
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
                <button className='search-driver-list-qr-button'>Escanear QR</button>
                <img className='qr-scan-image' src="/img/qr-scan.png" alt="QR" />
            </div>
            <Modal isOpen={isSessionExpired} onRequestClose={closeModal} />
        </div>
    );
};

export default DriverLink;

