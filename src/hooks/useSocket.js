import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'https://backriocuartocelulares.onrender.com';

export const useSocket = () => {
  const socketRef = useRef();

  useEffect(() => {
    // Crear conexión
    socketRef.current = io(SOCKET_URL);

    // Limpiar al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
}; 