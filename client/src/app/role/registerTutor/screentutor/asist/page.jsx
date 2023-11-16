"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../../../../style/asist.module.css';

const Attendance = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const [attendance, setAttendance] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleAttendance = (value) => {
        // Enviar la asistencia al backend
        fetch('http://localhost:3001/api/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ childId: 'uniqueChildId', attendance: value }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                setAttendance(value);
                setShowConfirmation(true); // Muestra la ventana flotante después de registrar la asistencia
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    const goBack = () => {
        window.history.back(); // Retroceder a la página anterior
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
            {attendance !== null ? (
                <p>Asistencia registrada: {attendance ? 'Sí' : 'No'}</p>
            ) : (
                <div className={styles.buttonContainer}>
                    <button onClick={() => handleAttendance(true)} className={styles.yesButton}>
                        Sí
                    </button>
                    <button onClick={() => handleAttendance(false)} className={styles.noButton}>
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
