"use client"

import Link from 'next/link';
import React, { useState } from 'react';
import '../style/styles.css';

const ROLE_DISPLAY_NAMES = {
    driver: 'Conductor',
    tutor: 'Tutor',
};

const Button = ({role, handleRoleSelection}) => (
  <button className={`role-button-${role}`} onClick={() => handleRoleSelection(role)}>
    {ROLE_DISPLAY_NAMES[role]}
  </button>
);

const SelectRole = () => {
    const [formData, setFormData] = useState({
        // ... otros campos
        role: '', // Nuevo campo para el rol (driver o tutor)
    });
    
    const handleRoleSelection = (role) => {
        setFormData({
            ...formData,
            role,
        });

        // Redirige a la página correspondiente
        if (role === 'driver') {
            window.location.href = '/role/registerDriver';
        } else if (role === 'tutor') {
            window.location.href = '/role/registerTutor';
        }
    };

    return (
        <div className='background-login-tutor'>
            <div className='titulo-role'>
                <div className='titulo-role-2'>
                    <strong>
                        <h1>¡Bienvenido!</h1>
                    </strong>
                </div>
                <div className='titulo-role-3'>
                    <strong>
                        <h1>Gracias por preferir Kowapp</h1>
                    </strong>
                </div>
            </div>
            <div className='index-div-logo'>
                <img src={'/img/kowappLogo.png'} className='logoKowapp'/>
            </div>
            <div className='titulo-role-4'>
                <h3>Cuéntanos</h3>
                <h3>¿Cuál será tu rol?</h3>
            </div>
            <div className='welcome-div-button'>
                <Button role="driver" handleRoleSelection={handleRoleSelection} />
                <Button role="tutor" handleRoleSelection={handleRoleSelection} />
            </div>
            <div className='definition-role'>
                <Link href={'/role/definition'}><img src='/img/interrogatorio.png' /></Link>
            </div>
        </div>
    );
};

export default SelectRole;
