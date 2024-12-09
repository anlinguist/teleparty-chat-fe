import React, { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Container,
  ScrollArea,
  TextInput,
  Button,
  Group,
  Avatar,
  Text,
  Box,
  Alert,
} from '@mantine/core';
import { SessionChatMessage } from 'teleparty-websocket-lib';
import { useParams } from 'react-router-dom';
import { IconAlertCircle, IconSend, IconUser } from '@tabler/icons-react';
import { useSocket } from '../contexts/SocketContext';
import JoinChatModal from '../Modals/JoinChatModal';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, sendMessage, userName, userIcon } = useSocket();
  const [newMessage, setNewMessage] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [joinModalOpened, setJoinModalOpened] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      if (chatId) {
        if (!userName) {
          setJoinModalOpened(true);
        } else {
          setJoinModalOpened(false);
        }
      }
      setInitializing(false);
    };

    initializeChat();
  }, [chatId, userName, userIcon, setJoinModalOpened]);

  useEffect(() => {
    if (!initializing) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, initializing]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    sendMessage(newMessage.trim());
    setNewMessage('');
  };

  if (initializing) {
    return (
      <Container size="lg" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
        <Group>
          <Avatar color="blue" radius="xl">
            {chatId?.charAt(0).toUpperCase()}
          </Avatar>
          <Text size="lg" fw={700}>
            Chat Room: {chatId}
          </Text>
        </Group>
      </header>

      <ScrollArea
        style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9' }}
        scrollbarSize={10}
        ref={scrollRef}
        offsetScrollbars
      >
        <Box>
          {messages.map((msg, index) => {
            return (
              <MessageItem key={index} message={msg} />
            )
          })}
        </Box>
      </ScrollArea>

      <Box p="md" style={{ borderTop: '1px solid #e0e0e0' }}>
        <form onSubmit={handleSendMessage}>
          <Group>
            <TextInput
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.currentTarget.value)}
              style={{ flex: 1 }}
              rightSection={<IconUser size={16} />}
            />
            <Button
              leftSection={<IconSend size={16} />}
              onClick={handleSendMessage}
              color="blue"
              type='submit'
              disabled={newMessage.trim() === ''}
            >
              Send
            </Button>
          </Group>
        </form>
      </Box>

      <JoinChatModal joinModalOpened={joinModalOpened} setJoinModalOpened={setJoinModalOpened} />
    </Container>
  );
};

export default ChatPage;

interface MessageItemProps {
  message: SessionChatMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isSystem = message.isSystemMessage;

  if (isSystem) {
    return (
      <Box my="sm" style={{ width: '100%' }}>
        <Alert icon={<IconAlertCircle size={16} />} title="System" color="blue" variant="outline">
          {message.userNickname} {message.body}
        </Alert>
      </Box>
    );
  }

  return (
    <Group align="flex-start" my="xs">
      <Avatar src={message.userIcon} alt={message.userNickname || 'User'} radius="xl" size="lg">
        {!message.userIcon && <IconUser size={20} />}
      </Avatar>

      <Box>
        <Group gap={5}>
          <Text fw={500}>{message.userNickname || 'Unknown'}</Text>
          <Text size="xs" c="dimmed">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </Group>
        <Text>{message.body}</Text>
      </Box>
    </Group>
  );
};