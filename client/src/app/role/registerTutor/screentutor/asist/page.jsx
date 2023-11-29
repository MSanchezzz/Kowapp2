"use client";

import React, { useState, useEffect } from 'react';
import styles from '../../../../style/asist.module.css';
import moment from 'moment';

const Attendance = ({ params, searchParams }) => {
  // Obtener studentId de las props correctamente
  const studentId = params?.studentId || searchParams?.studentId;

  const currentDate = new Date();
  const formattedDate = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
  const [attendance, setAttendance] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const registerAttendance = async (childId, attendance) => {
    console.log('Registrando asistencia para childId:', childId, 'attendance:', attendance);
    try {
      const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  
      // Utiliza la función getTutorIdForStudent para obtener el ID del tutor
      const tutorId = await getTutorIdForStudent(childId);
  
      const response = await fetch('http://localhost:3001/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tutorId, studentId: childId, attendance, dateTime }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del servidor:', data.message);
        setShowConfirmation(true);
      } else {
        const errorData = await response.json();
        console.error('Error al registrar la asistencia:', response.statusText, errorData);
      }
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
    }
  };
  const handleAttendance = async (value) => {
    try {
      console.log('Manejando la asistencia con valor:', value);

      if (studentId) {
        await registerAttendance(studentId, value);
        console.log('Asistencia registrada con éxito');
      } else {
        console.error('Error: studentId es undefined');
      }
    } catch (error) {
      console.error('Error al manejar la asistencia:', error);
    }
  };

  useEffect(() => {
    // Puedes poner lógica de inicialización aquí si es necesario
  }, [params, searchParams]);

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

      {attendance !== null && <p>Asistencia registrada: {attendance ? 'Asistió' : 'No asistió'}</p>}

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
