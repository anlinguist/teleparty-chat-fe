import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import socket from '../socket/socketManager';
import { MessageList, SessionChatMessage, SocketMessageTypes } from 'teleparty-websocket-lib';
import { Modal, Text, Center } from '@mantine/core';

interface SocketContextProps {
  socket: typeof socket;
  messages: SessionChatMessage[];
  userName: string | null;
  userIcon: string | null;
  setUserIcon: React.Dispatch<React.SetStateAction<string | null>>;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setMessages: React.Dispatch<React.SetStateAction<SessionChatMessage[]>>;
  sendMessage: (message: string) => void;
  joinChatRoom: (nickname: string, chatId: string, userIcon?: string) => Promise<MessageList | undefined>;
  createChatRoom: (nickname: string, userIcon?: string) => Promise<string>;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [userIcon, setUserIcon] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    socket.initializeSocket();

    const handleMessage = (message: SessionChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.setOnMessageCallback((socketMessage) => {
      console.log("Received message:", socketMessage);
      if (socketMessage.type === SocketMessageTypes.SEND_MESSAGE) {
        handleMessage(socketMessage.data);
      }
    });

    socket.setOnCloseCallback(() => {
      console.log('Socket closed');
      setIsModalOpen(true);
    });

    return () => {
      socket.teardown();
    };
  }, []);

  const contextValue: SocketContextProps = {
    socket,
    messages,
    userName,
    userIcon,
    setUserIcon,
    setUserName,
    setMessages,
    sendMessage: (message: string) => socket.sendMessage(message),
    joinChatRoom: async (nickname: string, chatId: string, userIcon?: string): Promise<MessageList | undefined> => {
      console.log('Joining chat room:', chatId);
      return await socket.joinChatRoom(nickname, chatId, userIcon);
    },
    createChatRoom: async (nickname: string, userIcon?: string): Promise<string> => {
      return await socket.createChatRoom(nickname, userIcon);
    }
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
      <Modal
        opened={isModalOpen}
        onClose={() => {}}
        withCloseButton={false}
        centered
        title="Connection Lost"
      >
        <Center>
          <Text>Please reload the page to reconnect.</Text>
        </Center>
      </Modal>
    </SocketContext.Provider>
  );
};