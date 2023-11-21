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
        try {
            const dateTime = new Date().toISOString(); // Utiliza ISO format para la fecha y hora
            const response = await fetch('http://localhost:3001/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ childId, attendance, dateTime }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                setAttendance(attendance);
                setShowConfirmation(true);
            } else {
                console.error('Error al registrar la asistencia:', response.statusText);
            }
        } catch (error) {
            console.error('Error al registrar la asistencia:', error);
        }
    };

    const handleAttendance = async (value) => {
        // Llama a la función para registrar la asistencia en la base de datos
        await registerAttendance('uniqueChildId', value);
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