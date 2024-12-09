import React, { useState } from 'react';
import {
  Container,
  Button,
  Group,
  Text,
  Stack,
} from '@mantine/core';
import JoinChatModal from '../Modals/JoinChatModal';
import CreateChatModal from '../Modals/CreateChatModal';

const HomePage: React.FC = () => {
  const [joinModalOpened, setJoinModalOpened] = useState(false);
  const [createModalOpened, setCreateModalOpened] = useState(false);

  return (
    <Container size="sm" style={{ marginTop: '100px' }}>
      <Stack gap="md" align="center">
        <Text size="xl" fw={700}>
          Welcome to Teleparty Chat
        </Text>
        <Group align="center" gap="md">
          <Button onClick={() => setJoinModalOpened(true)}>
            Join Chat Room
          </Button>
          <Button variant="outline" onClick={() => setCreateModalOpened(true)}>
            Create Chat Room
          </Button>
        </Group>
      </Stack>
      <JoinChatModal joinModalOpened={joinModalOpened} setJoinModalOpened={setJoinModalOpened} />
      <CreateChatModal createModalOpened={createModalOpened} setCreateModalOpened={setCreateModalOpened} />
    </Container>
  );
};

export default HomePage;