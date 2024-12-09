import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Container, Text, Center } from '@mantine/core';

const ErrorPage: React.FC = () => {
  const error = useRouteError() as { status: number; statusText?: string; data?: any };

  return (
    <Center style={{ height: '100vh' }}>
      <Container>
        <Text size="xl" fw={700} c="red">
          {error.status} {error.statusText}
        </Text>
        <Text>{error.data || 'An unexpected error occurred.'}</Text>
      </Container>
    </Center>
  );
};

export default ErrorPage;