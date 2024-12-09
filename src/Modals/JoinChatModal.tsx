import { Button, Group, Modal, Notification, Stack, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useLocation, useNavigate } from 'react-router-dom';

function JoinChatModal({
  joinModalOpened,
  setJoinModalOpened,
}: {
  joinModalOpened: boolean;
  setJoinModalOpened: (opened: boolean) => void;
}) {
  const { joinChatRoom, setMessages, setUserName, setUserIcon } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [joinNickname, setJoinNickname] = useState('');
  const [joinChatId, setJoinChatId] = useState(location.pathname.slice(1));
  const [joinUserIcon, setJoinUserIcon] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleJoinChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinNickname || !joinChatId || joinNickname.trim() === '' || joinChatId.trim() === '') {
      setError('Please provide both nickname and chat ID.');
      return;
    }

    setUserName(joinNickname);
    setUserIcon(joinUserIcon);

    setError(null);
    try {
      const response = await joinChatRoom(joinNickname, joinChatId, joinUserIcon || undefined);
      setJoinModalOpened(false);
      setMessages(response?.messages || []);
      setJoinNickname('');
      setJoinChatId('');
      if (location.pathname === '/') {
        navigate(`/${joinChatId}`);
      }
    } catch (err) {
      setError('Failed to join chat room. Please try again.');
      console.error(err);
    }
  };

  return (
    <Modal
      opened={joinModalOpened}
      onClose={() => {
        setJoinModalOpened(false);
        setError(null);
      }}
      title="Join a Chat Room"
    >
      <form onSubmit={handleJoinChat}>
        <Stack gap="sm">
          <TextInput
            label="Nickname"
            placeholder="Enter your nickname"
            required
            value={joinNickname}
            onChange={(e) => setJoinNickname(e.currentTarget.value)}
          />
          <TextInput
            label="Chat ID"
            placeholder="Enter the Chat ID"
            required
            value={joinChatId}
            onChange={(e) => setJoinChatId(e.currentTarget.value)}
          />
          <TextInput
            label="User Icon (Optional)"
            placeholder="Enter a URL for your avatar"
            value={joinUserIcon}
            onChange={(e) => setJoinUserIcon(e.currentTarget.value)}
          />
          {error && (
            <Notification color="red" title="Error" withCloseButton={false}>
              {error}
            </Notification>
          )}
          <Group align="right" mt="md">
            <Button type="submit">Join</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default JoinChatModal;