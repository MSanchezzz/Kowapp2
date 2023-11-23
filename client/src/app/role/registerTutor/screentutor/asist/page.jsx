"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../../../../style/asist.module.css';

const Attendance = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const [attendance, setAttendance] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const registerAttendance = async (studentId, present) => {
        try {
            const response = await fetch('http://localhost:3001/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentId, present }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                setAttendance(present);
                setShowConfirmation(true);
            } else {
                console.error('Error al registrar la asistencia:', response.statusText);
            }
        } catch (error) {
            console.error('Error al registrar la asistencia:', error);
        }
    };


    const handleAttendance = async (present) => {
        try {
            // Suponiendo que tienes un ID de estudiante específico, reemplázalo con la lógica real para obtener el ID del estudiante.
            const studentId = 1; // Reemplázalo con la lógica para obtener el ID del estudiante.

            await registerAttendance(studentId, present);
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