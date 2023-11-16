"use client"

import React, { useState } from 'react';
import '../../../../../../style/styles.css';
import QRCode from 'qrcode.react';
import Link from 'next/link';

function App() {
  const [driverId, setDriverId] = useState('23'); // Aquí puedes manejar el ID del conductor

  const handleDriverIdChange = (e) => {
    setDriverId(e.target.value);
  };

  return (
    <div className='list-student-Call'>
      <h1 className='title-qr'>QR para añadir al tutor</h1>
      <div className='div-qr'>
        <QRCode value={driverId} />
        <Link href={'/role/registerDriver/screendriver/profile/tutorlink'}>Vovler</Link>
      </div>
    </div>
  );
}

export default App;
