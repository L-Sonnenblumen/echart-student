// src/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import MainLayout from '../layout/mainLayout';
import Home from '../pages/Home';
import AuthRoute from '../pages/AuthRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    // 带有底部导航栏的主布局 (Tab 页)
    path: '/',
    element: (
      <AuthRoute>
        <MainLayout />
      </AuthRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      // 成绩页 stats 等我们画好了再往这里加
    ],
  },
  {
    // 兜底路由：匹配不到的路径全回首页
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
