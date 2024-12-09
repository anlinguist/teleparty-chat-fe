import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ChatPage from '../pages/ChatPage';
import RootLayout from '../layouts/RootLayout';
import ErrorPage from '../pages/ErrorPage';
import { homeLoader } from '../loaders/homeLoader';
import { chatLoader } from '../loaders/chatLoader';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
      },
      {
        path: ':chatId',
        element: <ChatPage />,
        loader: chatLoader,
      },
    ],
  },
]);

export default router;