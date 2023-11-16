"use client"
import '../../../../../style/styles.css';
import React, {useState} from 'react';
import Link from 'next/link';

const TutorLink = () =>{

    const [OptionsList, setOptionsList] = useState(false);

    const OptionsLinkTutor = () => {
        setOptionsList(!OptionsList);
    };
    return(
        <div className='list-student-Call'>
            <div>
                <Link href={'/role/registerDriver/screendriver/profile'}>Volver</Link>
            </div>
            <div>
                <h1 className='Title-page'>Tutores asociados</h1>
            </div>
            <div>
                <button onClick={OptionsLinkTutor} className='button-options-link'>
                    <div className='list-student'>
                        <div>
                            <p>imgen</p>
                        </div>
                        <div className='list-student-info'>
                            <p>Nombre: </p>
                            <p>Colegio: </p>
                        </div>
                    </div>
                    {OptionsList && (
                        <div>
                            <button className='Tutor-link-acept'>Aceptar</button>
                            <button className='Tutor-link-rechazar'>Rechazar</button>
                        </div>
                    )}
                </button>
            </div>
            <div className='button-generate-qr'>
                <Link href={'/role/registerDriver/screendriver/profile/tutorlink/generateQR'}>Codigo QR</Link>
            </div>
        </div>
    );
};

export default TutorLink;