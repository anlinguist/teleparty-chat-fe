import { LoaderFunctionArgs } from 'react-router-dom';
import socket from '../socket/socketManager';

export interface ChatData {
    chatId: string;
}

export const chatLoader = async ({ params }: LoaderFunctionArgs): Promise<ChatData> => {
    const { chatId } = params;

    if (!chatId) {
        throw new Error('No chat ID provided');
    }

    socket.initializeSocket();

    await new Promise<void>((resolve, reject) => {
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

    return { chatId };
};