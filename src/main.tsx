import { createRoot } from 'react-dom/client';
import './index.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { RouterProvider } from 'react-router-dom';
import router from './routing/router.tsx';
import { SocketProvider } from './contexts/SocketContext.tsx';

createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <Notifications />
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </MantineProvider>
)
