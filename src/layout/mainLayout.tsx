// src/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="app-container">
      {/* 滚动内容区 */}
      <div
        className="scroll-content"
        style={{ paddingBottom: 'calc(var(--nav-h) + var(--safe-bottom))' }}
      >
        <Outlet />
      </div>

      {/* 底部导航 */}
    </div>
  );
}
