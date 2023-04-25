import { io } from 'socket.io-client';

export const socket = io(`${process.env.REACT_APP_HOST}`, {
  cors: { origin: '*' },
  // path: '/socket.io/',
  transports: ['websocket'],
});

export default {};
