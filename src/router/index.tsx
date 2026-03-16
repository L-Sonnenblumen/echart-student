import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from '../pages/AppContext';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Chat from '../pages/Chat';

// 使用一个全局 Layout 来包裹 Provider，确保所有路由都能访问状态
const RootLayout = () => {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'home', element: <Home /> },
      { path: 'chat/:stage', element: <Chat /> }, // stage可以是 initial, pre, in, post
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
