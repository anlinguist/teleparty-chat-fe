import { Button, Group, Modal, Notification, Stack, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';

function CreateChatModal({
  createModalOpened,
  setCreateModalOpened,
}: {
  createModalOpened: boolean;
  setCreateModalOpened: (opened: boolean) => void;
}) {
  const { createChatRoom, setUserName, setUserIcon } = useSocket();
  const navigate = useNavigate();
  const [createNickname, setCreateNickname] = useState('');
  const [createUserIcon, setCreateUserIcon] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createNickname || createNickname.trim() === '') {
      setError('Please provide a nickname.');
      return;
    }
    setError(null);
    try {
      const newChatId = await createChatRoom(createNickname, createUserIcon || undefined);
      console.log('Chat created:', newChatId);
      setUserName(createNickname);
      setUserIcon(createUserIcon);
      navigate(`/${newChatId}`);

      setCreateModalOpened(false);
      setCreateNickname('');
      setCreateUserIcon('');
    } catch (err) {
      setError('Failed to create chat room. Please try again.');
      console.error(err);
    }
  };

  return (
    <Modal
      opened={createModalOpened}
      onClose={() => setCreateModalOpened(false)}
      title="Create a Chat Room"
    >
      <form onSubmit={handleCreateChat}>
        <Stack gap="sm">
          <TextInput
            label="Nickname"
            placeholder="Enter your nickname"
            required
            value={createNickname}
            onChange={(e) => setCreateNickname(e.currentTarget.value)}
          />
          <TextInput
            label="User Icon (Optional)"
            placeholder="Enter a URL for your avatar"
            value={createUserIcon}
            onChange={(e) => setCreateUserIcon(e.currentTarget.value)}
          />
          {error && (
            <Notification color="red" title="Error" withCloseButton={false}>
              {error}
            </Notification>
          )}
          <Group align="right" mt="md">
            <Button type="submit">Create</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

export default CreateChatModal;