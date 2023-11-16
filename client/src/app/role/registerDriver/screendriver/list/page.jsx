"use client"
import '../../../../style/styles.css';
import Link from 'next/link';
import React, { useState } from 'react';

const RollCall = () => {
  const [passengers, setPassengers] = useState([
    { name: 'Pasajero 1', school: 'Escuela 1' },
    { name: 'Pasajero 2', school: 'Escuela 2' },
    // Agrega más objetos de pasajeros según sea necesario
  ]);

  const [isChecked, setChecked] = useState(Array(passengers.length).fill(false));

  const handleCheckboxChange = (index) => {
    const newCheckedState = [...isChecked];
    newCheckedState[index] = !newCheckedState[index];
    setChecked(newCheckedState);
  };

  return (
    <div className='list-student-Call'>
      <div>
        <Link href={'/role/registerDriver/screendriver'}>
          <img src='https://cdn-icons-png.flaticon.com/512/6927/6927467.png' className='back-button' />
        </Link>
      </div>
      <h1 className='Title-page'>Pasar lista</h1>

      {passengers.map((passenger, index) => (
        <div className='list-student-content' key={index}>
          <div className='list-student'>
            <img src='https://cdn-icons-png.flaticon.com/512/5294/5294731.png' className='icon-nino-profile'/>
            <div className='list-student-info'>
              <p>Nombre: {passenger.name}</p>
              <p>Colegio: {passenger.school}</p>
            </div>

            <div className='list-student-label'>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RollCall;