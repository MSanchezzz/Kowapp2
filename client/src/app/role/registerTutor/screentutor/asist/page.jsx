"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../../../../style/asist.module.css';




const Attendance = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const [attendance, setAttendance] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const registerAttendance = async (childId, attendance) => {
        console.log('Registrando asistencia para childId:', childId, 'attendance:', attendance);
        try {
          const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
          
          console.log('Realizando solicitud al servidor...');
          const response = await fetch('http://localhost:3001/api/attendance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ childId, attendance, dateTime }),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log('Respuesta del servidor:', data.message);
            setShowConfirmation(true);
          } else {
            const errorData = await response.json(); // Obtén el cuerpo del error si está presente
            console.error('Error al registrar la asistencia:', response.statusText, errorData);
          }
        } catch (error) {
          console.error('Error al registrar la asistencia:', error);
        }
      };
    const handleAttendance = async (childId, present) => {
        try {
            await registerAttendance(childId, present);
        } catch (error) {
            console.error('Error al manejar la asistencia:', error);
        }
    };

    const goBack = () => {
        window.history.back();
    };

    const closeConfirmation = () => {
        setShowConfirmation(false);
    };


    return (
        <div className={styles.container}>
            <div className={styles.topLeft}>
                <button onClick={goBack}>Volver</button>
            </div>
            <h1 className={styles.title}>Registro de Asistencia del día {formattedDate}</h1>

            {/* Mostrar la asistencia registrada */}
            {attendance !== null && (
                <p>Asistencia registrada: {attendance ? 'Asistió' : 'No asistió'}</p>
            )}

            {!attendance && (
                <div className={styles.buttonContainer}>
                    <button onClick={() => handleAttendance(1, true)} className={styles.yesButton}>
                        Sí
                    </button>
                    <button onClick={() => handleAttendance(1, false)} className={styles.noButton}>
                        No
                    </button>
                </div>
            )}

            {/* Ventana flotante de confirmación */}
            {showConfirmation && (
                <div className={styles.confirmationPopup}>
                    <p>Asistencia Confirmada</p>
                    <button onClick={closeConfirmation}>Cerrar</button>
                </div>
            )}
        </div>
    );
};

export default Attendance;
