// client/src/app/layout.jsx
// Esta es la plantilla base para todas las páginas de la aplicación.

'use client'

import React, { useState } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {  
  return (
      <html lang="es">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <title>Kids on Wheels</title>
          <link rel="icon" href="/img/kowappLogo.png" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
  );
}
