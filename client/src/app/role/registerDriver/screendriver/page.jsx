"use client"

import Link from 'next/link'; // Importar el componente Link de next para navegar entre páginas
import '../../../style/styles.css'; // Importar el css
import React, { useState } from 'react'; // Importar el hook useState
import MapContainer from './mapa/mapa'
import { ChakraProvider, theme } from '@chakra-ui/react'


// Componente para el formulario de inicio de sesión
const ScreenDriver = () => {
    const [ventanaAbierta, setVentanaAbierta] = useState(false);

    const handleToggleVentana = () => {
        setVentanaAbierta(!ventanaAbierta);
    };
    return(
        <div>
            <div className='screen-driver-navegacion'>
                <Link href="/role/registerDriver/screendriver/profile">
                    <img src="/img/ajustes.png" />
                </Link>
            </div>
            <div className='screen-driver-map'>
                <React.StrictMode>
                    <ChakraProvider theme={theme}>
                        <MapContainer />
                    </ChakraProvider>
                </React.StrictMode>
            </div>

            <div className="screen-driver-contenedor-option">
                <button onClick={handleToggleVentana}>
                    <img src="/img/up.png" className='button-up'/>
                </button>

                {ventanaAbierta && (
                    <div className="screen-driver-contenedor-widows">
                        <button onClick={handleToggleVentana}>
                            <img src="/img/down.png" className='button-down' />
                        </button>
                        <table className='screen-driver-option'>
                            <tbody>
                                <tr>
                                    <td>Confirmado</td>
                                    <td>Prioridad</td>
                                    <td>Abordo</td>
                                </tr>
                                <tr className='screen-driver-estadistic'>
                                    <td>25/30</td>
                                    <td>Sofia PL</td>
                                    <td>0/30</td>
                                </tr>
                                <tr>
                                    <td> <Link href={''}>Comenzar ruta</Link></td>
                                    <td> <Link href={'/role/registerDriver/screendriver/list'} >pasar lista</Link></td>
                                    <td> <Link href={'/role/registerDriver/screendriver/editruta'}>Editar ruta</Link></td>
                                </tr>
                            </tbody>
                            
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

};

export default ScreenDriver; 
