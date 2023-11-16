// client/src/app/role/registerTutor/screentutor/profile/page.jsx

"use client"

import { useState, useEffect } from 'react';
import '../../../../style/styles.css';
import Link from 'next/link';
import Modal from '../../../../../components/SessionExpiredModal'; // Asegúrate de importar el componente de modal
import { useRouter } from 'next/navigation';

const ProfileTutor = () => { 

  // Nuevo estado para la imagen
  const [profileImage, setProfileImage] = useState(null);

  // Función para mostrar la previsualización de la imagen
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // Crear una URL para la previsualización de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Estado para controlar la visibilidad del menú
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Función para alternar el menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para manejar la carga de la imagen
  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('file', profileImage);

    fetch('http://localhost:3001/upload-profile-picture', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
    })
    .catch(error => {
      console.error('Error al cargar la imagen:', error);
    });
  };
  
  const logout = () => {  
    fetch('http://localhost:3001/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      router.push('/login'); // Asegúrate de tener la ruta de login correcta
    })
    .catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  };

  const listarEstudiantes = () => {
    router.push('../../registerTutor/screentutor/profile/students');
  };
  

  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false); // Nuevo estado para controlar el modal
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    address: '',
    rut: '',
    phone: '',
    emergency_phone: '',
    id: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/tutor-profile', {
      method: 'GET',
      credentials: 'include', // para asegurarse de enviar la cookie HttpOnly con la solicitud
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('No autorizado');
      }
    })
    .then(profileData => {
      setUserData({
        name: profileData.names,
        surname: profileData.surnames,
        address: profileData.address,
        rut: profileData.rut,
        phone: profileData.number,
        emergency_phone: profileData.emergency_contact_number,
        id: profileData.id
      });
    })
    .catch(error => {
      console.error('Error:', error);
      setIsSessionExpired(true);
      // Aquí puedes manejar la redirección al login si es necesario
    });
  }, []);

  useEffect(() => {
    // Suponiendo que tienes un endpoint '/get-tutor-profile-picture' que devuelve la URL firmada de la imagen
    fetch('http://localhost:3001/get-tutor-profile-picture', {
      credentials: 'include', // Asegúrate de que esto coincida con tus requisitos de CORS y autenticación
    })
    .then(response => response.json())
    .then(data => {
      setImagePreviewUrl(data.imageUrl); // Establece la URL de la imagen en el estado
    })
    .catch(error => {
      console.error('Error al obtener la imagen de perfil:', error);
      // Aquí puedes decidir si quieres establecer una imagen de perfil por defecto en caso de error
    });
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente  

  // Función para cerrar el modal
  const closeModal = () => {
    setIsSessionExpired(false);
    router.push('../../../../../login'); // Redirige al usuario al inicio de sesión
  };

  return (
    <div className='profile-tutor-container'>
      <div className='profile-tutor-header'>
        <div className='profile-tutor-options-header'>
          <Link href="/role/registerTutor/screentutor">
            <img src="/img/back.png" alt="Volver" className="back-icon" />
          </Link>
          <div className='menu-icon-container' onClick={toggleMenu}>
            <img src="/img/menu.png" alt="Menú"  className="menu-icon" width={32} height={32}/>
          </div>
        </div>
        <div className='profile-tutor-avatar'>
          <input
              type="file"
              id="profileImageInput"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          <label htmlFor="profileImageInput">
            <div
              className="avatar-preview"
              style={{
                backgroundImage: `url(${imagePreviewUrl})`,
              }}
            >
              <img src="/img/editar.png" className="change-image-text" width={35} height={35}/>
            </div>
          </label>
        </div>
        {profileImage && ( // Esta línea verifica si profileImage tiene un valor
          <div className='upload-buton-container'>
            <button onClick={handleImageUpload} className="upload-button">
              Guardar Imagen
            </button>
          </div>
        )}
        <p className='nombre-perfil-usuario'>{`${userData.name}`}</p>
        <p className='nombre-perfil-usuario'>{`${userData.surname} (${userData.id})`}</p>
        <div className='profile-tutor-name'>
          <img className='logo-kowapp-perfil-tutor'src="/img/logokow.png" alt="logokowprofile" height={32} width={32}/>
        </div>
      </div>
      <div className='profile-tutor-info'>
        <div class='info-container'>
          <div class='info'>
            <span class='subtitle-info-profile'>Estudiantes:</span>
            <span class='description'>1</span>
          </div>
          <div class='info'>
            <span class='subtitle-info-profile'>Calificación:</span>
            <div className='perfil-tutor-stars-container'>
              <span class='description'>+5</span>
              <img className='star-image' src="/img/star.png" alt="Star" width={20} height={20} />
            </div>
          </div>
          <div class='info'>
            <span class='subtitle-info-profile'>Cuenta:</span>
            <span class='description'>Simple</span>
          </div>
        </div>

        <div className='contact-section'>
          <span>Residencia: {userData.address}</span>
          <span>Contacto: {userData.phone}</span>
          <span>Contacto de emergencia: {userData.emergency_phone}</span>
          <span>Rut: {userData.rut}</span>
        </div>
      </div>
      {isMenuOpen && (
        <div className='dropdown-menu'>
          <div className='students'onClick={listarEstudiantes}>Estudiantes</div>
          <div className='logout-tutor'onClick={logout}>Cerrar Sesión</div>
        </div>
      )}
      <div className='profile-tutor-actions'>
        <Link href='/role/registerTutor/screentutor/profile/driverlink'>
          Enlace a conductor
        </Link>
        <Link href=''>
          Registro Viajes
        </Link>
      </div>
      <Modal isOpen={isSessionExpired} onRequestClose={closeModal} />
    </div>
  );
};

export default ProfileTutor;
