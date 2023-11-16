import React from "react";
import '../../../../../style/styles.css';
import Link from 'next/link';

const School = () =>{
    return(
        <div className="backgraund-option-driver">
            <div>
                <Link href={'/role/registerDriver/screendriver/profile'}>
                    <img src='https://cdn-icons-png.flaticon.com/512/6927/6927467.png' className='back-button' />
                </Link>
                <h1 className='title-page-school'>Escuelas asociadas</h1>
            </div>

            <div className="content-schools">
                <h1>San joaquín</h1>
                <a>Villarrica 1653, 8650244 Renca, Región Metropolitana</a>
                <img src="https://www.astoreca.cl/wp-content/uploads/2023/09/sanjoaquin-entrada.jpg" />
            </div>

            <div className="content-schools">
                <h1>Polivalente San José de Renca</h1>
                <a>José Manuel Balmaceda 4883, 8650140 Renca, Región Metropolitana</a>
                <img src="https://colegiosanjosederenca.cl/wp-content/uploads/2019/01/implementacion-deportiva-1-1.jpg" />
            </div>

        </div>
    )
}

export default School;