import { io } from 'socket.io-client';

export const socket = io('http://localhost:7070', {
  cors: { origin: '*' },
  transports: ['websocket'],
});

export default {};
