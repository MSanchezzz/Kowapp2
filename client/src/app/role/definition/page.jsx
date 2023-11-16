"use client"

import React from "react";
import Link from 'next/link';
import '../../style/styles.css';

const ViewDefinitionRole = () =>{
    return(
        <view className='background-login-tutor'>
            <div className='index-div-logo'>
                <img src={'/img/kowappLogo.png'} className='logoKowapp'/>
                <img src="/img/mano-sosteniendo-corazon.png"/>
            </div>
            <div className="definition-driver-tutor">
                <img src="/img/volante.png"/>
                <p>
                    Conductor es el encargado de la seguridad del trayecto de nuestros 
                    hijos/as de la casa a la escuela y a su regreso. Por lo anterior, 
                    es necesario tener en cuenta una serie de normas y recomendaciones 
                    vigentes a fin de tener un viaje seguro sin riesgos.
                </p>
            </div>
            <div className="definition-driver-tutor">
                <img src="/img/siguiendo.png"/>
                <p>
                    Se denomina tutor al titular, padre, madre o apoderado legal del estudiante 
                    que vive en la misma vivienda que su pupilo y/o que tiene contacto diaro o 
                    sistematico con él mismo.
                </p>
            </div>
            <div style={{paddingTop: '30px'}}>
                <Link href={'/role'}>
                    <img src="/img/iconoCerrar.png" />
                </Link>
            </div>
        </view>
    )
}

export default ViewDefinitionRole;