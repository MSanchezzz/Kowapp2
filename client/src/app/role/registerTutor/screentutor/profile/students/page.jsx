// src/components/StudentList.js

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../../../../style/styles.css';
import { useRouter } from 'next/navigation';
import Modal from '../../../../../../components/SessionExpiredModal';
import StudentFormModal from '../../../../../../components/StudentFormModal'; // Asegúrate de crear este nuevo componente

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_nombre: '',
    student_surname: '',
    rut: '',
    student_school: '',
    student_home: '',
  });
  const router = useRouter();

  useEffect(() => {

      fetch('http://localhost:3001/list-students', {
          method: 'GET',
          credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
          if (Array.isArray(data)) {
              setStudents(data)
          } else {
              console.error("Data from server is not an array:", data);
              setIsSessionExpired(true);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          setIsSessionExpired(true);
      });
  }, []); 

  const handleNewStudentChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });
  };

  const checkRutExists = async (rut) => {
    try {
      const response = await fetch(`http://localhost:3001/check-student/${rut}`);
      const data = await response.json();
      console.log('Respuesta de checkRutExists:', data); // Agregar para depuración
      return data.exists;
    } catch (error) {
      console.error('Error al verificar el RUT:', error);
      return false;
    }
  };  

  const addNewStudent = async () => {
    try {
      const rutExists = await checkRutExists(newStudent.rut);
      if (rutExists) {
        alert('Este RUT ya está registrado.');
        // Aquí podrías mostrar un mensaje de error en la interfaz de usuario
        return; // Detener la ejecución si el RUT ya existe
      }
  
      // El código para agregar el estudiante se ejecuta solo si el RUT no existe
      const response = await fetch('http://localhost:3001/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(newStudent),
      });
  
      if (!response.ok) {
        throw new Error('No fue posible agregar al nuevo estudiante');
      }
  
      const data = await response.json();
      console.log('Estudiante agregado con éxito:', data);
      closeAddStudentModal();
      fetchStudents(); // Actualizar la lista de estudiantes
    } catch (error) {
      console.error('Error al agregar el nuevo estudiante:', error);
    }
  };
  

  // Función para obtener la lista actualizada luego de agregar un nuevo estudiante
  const fetchStudents = () => {
    fetch('http://localhost:3001/list-students', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        throw new Error('Los datos recibidos no son una lista de estudiantes:', data);
      }
    })
    .catch(error => {
      console.error('Error al obtener la lista de estudiantes:', error);
      setIsSessionExpired(true);
    });
  };

  const openAddStudentModal = () => {
    setNewStudent({ // Reiniciar el estado de newStudent a valores vacíos
      student_nombre: '',
      student_surname: '',
      rut: '',
      student_school: '',
      student_home: '',
    });
    setIsAddingStudent(true); // Abrir el modal
  };  

  const closeAddStudentModal = () => {
    setIsAddingStudent(false);
  };

  const closeModal = () => {
    setIsSessionExpired(false);
    router.push('../../../../../login');
  };

    return (
        <div className='search-driver-page'>
            <div className='search-driver-header'>
                <div className='search-driver-options'>
                    <Link href={'/role/registerTutor/screentutor/profile'}>
                        <img src="/img/back.png" alt="Back" className="back-icon"/>
                    </Link>
                </div>
                <div>
                    <h1 className='Title-page-driverlink'>Lista de Estudiantes</h1>
                </div>
                <div className='search-driver-filters'>
                </div>
            </div>
            <div className='search-driver-list'>
                {students.map((student, index) => (
                    <div 
                        key={student.student_id}
                        className='search-driver-item' 
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <img src="/img/profile.png" alt="Student Avatar" className="driver-avatar"/>
                        <div className='search-driver-info-container'>
                            <p className='search-driver-name-driver'>{student.student_nombre + " " + student.student_surname}</p>
                            <p className='search-driver-info-item'>{student.rut}</p>
                            <p className='search-driver-info-item'>N/A</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='search-driver-list-qr-button-div'>
              <button className='add-student' onClick={openAddStudentModal}>
                Nuevo Estudiante
              </button>
            </div>
            {isAddingStudent && (
              <StudentFormModal
                student={newStudent}
                onChange={handleNewStudentChange}
                onSave={addNewStudent}
                onCancel={closeAddStudentModal}
              />
            )}
            <Modal isOpen={isSessionExpired} onRequestClose={closeModal} />
        </div>
    );
  
};

export default StudentList;
