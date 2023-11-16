"use client"

import {useState} from 'react';
import '../../../../style/styles.css';
import Link from 'next/link';


const ProfileDriver = () => { 
  const [name, setName] = useState(localStorage.getItem('name'));
  const [surname, setSurname] = useState(localStorage.getItem('surnames'));
  const [contac, setContac] = useState(localStorage.getItem('contacto'));
  const [contacEmer, setContacEmer] = useState(localStorage.getItem('contactoEmerg'));
  const [modelo, setModelo] = useState(localStorage.getItem('modelo'));
  return (
    <div className='profile-conductor-info'>
      <div className='rofile-conductor-volver'>
        <Link href={'/role/registerDriver/screendriver'}>
          <img src="/img/back.png" className='button-back'/>
        </Link>
      </div>
      <div>
        <img/>
        <p>nombre del conductor:</p>
        <p>{name + " " + surname}</p>
      </div>
      <div className='profile-conductor-table-info'>
        <table>
          <thead>
            <tr>
              <td>Edad: </td>
              <td>Calificación: </td>
              <td>Cupo: </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>33</td>
              <td>5</td>
              <td>30/30</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='profile-conductor-table-contac-info'>
        <table>
          <tr>
            <td>Recidencia: </td>
            <td></td>
          </tr>
          <tr>
            <td>Conatcto: </td>
            <td>{contac}</td>
          </tr>
          <tr>
            <td>Emergencia: </td>
            <td>{contacEmer}</td>
          </tr>
          <tr>
            <td>Vehiculo: </td>
            <td>{modelo}</td>
          </tr>
        </table>
      </div>
      <div className='profile-conductor-navegation'>
        <Link href={'/role/registerDriver/screendriver/profile/tutorlink'} >Enlace a tutor</Link>
        <Link href={'/role/registerDriver/screendriver/profile/school'} >Escuelas</Link>
        <Link href={'/role/registerDriver/screendriver/profile/registertrip'} >Registro Viajes</Link>
      </div>
    </div>
  );
};

export default ProfileDriver;
