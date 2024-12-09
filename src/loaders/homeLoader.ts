import socket from '../socket/socketManager';

export const homeLoader = async () => {
  socket.initializeSocket();

  return new Promise<void>((resolve, reject) => {
    if (socket.isConnected) {
      resolve();
    } else {
      socket.setOnConnectionReadyCallback(() => {
        resolve();
      });

      setTimeout(() => {
        reject(new Error('Connection timed out'));
      }, 10000);
    }
  });
};