import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../app/style/stlyeSessionExpired.css'

const SessionExpiredModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Session Expired Modal"
      className="custom-modal" // Asigna una clase personalizada al modal
      overlayClassName="custom-overlay" // Asigna una clase personalizada al fondo del modal
    >
      <h2 className='h2'>Sesión Expirada</h2>
      <p className='p'>Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</p>
      <button className='button' onClick={onRequestClose}>Cerrar</button>
    </Modal>
  );
};

export default SessionExpiredModal;
