import React from 'react';
import { Loader, Center } from '@mantine/core';

const LoadingSpinner: React.FC = () => (
  <Center style={{ height: '100vh' }}>
    <Loader size="xl" />
  </Center>
);

export default LoadingSpinner;
