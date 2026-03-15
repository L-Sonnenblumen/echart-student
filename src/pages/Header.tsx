import { type ReactNode } from 'react';

interface HeaderProps {
  title: string;
  leftNode?: ReactNode;
}

export default function Header({ title, leftNode }: HeaderProps) {
  return (
    <div className="chat-header">
      <div style={{ width: 36, display: 'flex' }}>
        {leftNode || <button className="chat-header-btn"></button>}
      </div>
      <div className="chat-header-title">{title}</div>
      <div style={{ width: 36 }}></div> {/* 右侧占位，保证标题绝对居中 */}
    </div>
  );
}
