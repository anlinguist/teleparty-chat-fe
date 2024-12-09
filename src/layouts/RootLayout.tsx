import React from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const RootLayout: React.FC = () => {
  const navigation = useNavigation();

  return (
    <>
      {navigation.state === 'loading' ? (
        <LoadingSpinner />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default RootLayout;
