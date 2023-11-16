"use client";
import React, { useState, useEffect, useRef} from 'react';
import { io } from 'socket.io-client';
import chatStyle from '../../../../style/chat.module.css';
import { useRouter } from 'next/navigation';

const { v4: uuidv4 } = require('uuid');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatRoom = 'nombre_de_sala';
  const userId = uuidv4();
  const socketRef = useRef(null); // Creamos la referencia para el socket
  const router = useRouter();

  // Función para manejar el inicio de sesión del usuario
  const handleLogin = () => {
    try {
      socket.emit("login", userId);
      console.log("Usuario conectado", userId);
    } catch (error) {
      socket.emit("error", "Hubo un error en el inicio de sesión");
      console.error("Error en el inicio de sesión:", error);
    }
  };

  const backToProfile = () => {
    router.push('../../../../role/registerTutor/screentutor');
  };

  useEffect(() => {
    // Asignamos el socket a la referencia aquí
    socketRef.current = io('http://localhost:3002');

    socketRef.current.on('mensaje', (data) => {
      const newMessage = { senderId: data.senderId, message: data.message };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socketRef.current.emit('joinChat', chatRoom);

    // Función para manejar el inicio de sesión del usuario
    socketRef.current.emit('login', userId);
    console.log('Usuario conectado', userId);

    return () => {
      socketRef.current.off('mensaje');
      socketRef.current.emit('leaveChat', chatRoom);
      socketRef.current.disconnect();
    };
  }, []);

  // Ahora, `enviarMensaje` tiene acceso a `socket` a través de `socketRef.current`
  const enviarMensaje = () => {
    if (message.trim() !== '' ) {
      socketRef.current.emit('mensaje', { senderId: userId, chatRoom, message });
      setMessage('');
    }
  };

  return (
    <div className="chat-container-background">
      <div className='chat-options'>
        <button className={chatStyle.unionBotton1} onClick={handleLogin}>Unirse</button>
        <button className={chatStyle.unionBotton2} onClick={backToProfile}>Salir</button>
      </div>
      <title> Chat en vivo </title>
      <footer className={chatStyle.chatFooter}>
        <div className={chatStyle.centerContent}>
          <p className={chatStyle.p}>Chat en vivo</p>
          <img
            src="/img/button.png"
            alt="chat en vivo"
            style={{ width: "15px", marginLeft: "5px" }}
          />
        </div>
      </footer>
      <div>
        <div className={chatStyle.chatBubble}>
          <div className={chatStyle.messagescontainer}>
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.senderId === userId ? "sent-message" : "received-message"
                }
              >
                <p>{msg.message}</p>
              </div>
            ))}
          </div>
          <div className={chatStyle.sentmessage}>
            <input
              className={chatStyle.senderName}
              type="text"
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></input>
            <div
              alt="Envíar"
              title="Envía un mensaje"
              className={chatStyle.senderBotton}
              onClick={enviarMensaje}>
              <img src="/img/send.png" alt="send" width={20} height={20}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;
