import { useEffect, useRef, useState } from 'react';

// 打字机组件保持不变...
function TypewriterText({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 50);
    return () => clearInterval(timer);
  }, [text, onComplete]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && <span className="cursor-blink" />}
    </span>
  );
}

// 👉 更新了 Message 接口，加入 type
export interface Message {
  id: string;
  role: 'ai' | 'user';
  type: 'text' | 'voice' | 'image'; // 消息类型
  content: string;
  isNew?: boolean;
  audioUrl?: string;
  imageUrl?: string;
}

export default function Panel({ messages }: { messages: Message[] }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // 控制图片放大

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [messages]);

  const playUserVoice = (url?: string) => {
    if (url) new Audio(url).play();
  };

  return (
    <>
      <div className="chat-panel" ref={panelRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`msg-row ${msg.role}`}>
            <div
              className={`avatar ${msg.role === 'ai' ? 'avatar-ai' : 'avatar-user'}`}
            >
              {msg.role === 'ai' ? '🤖' : '👤'}
            </div>

            {/* 根据消息类型渲染不同的内容 */}
            {msg.role === 'user' ? (
              msg.type === 'image' && msg.imageUrl ? (
                // 渲染用户发送的图片
                <div
                  className="bubble bubble-image-wrapper"
                  onClick={() => setPreviewImage(msg.imageUrl!)}
                >
                  <img src={msg.imageUrl} alt="已发送的图片" />
                </div>
              ) : (
                // 渲染用户发送的语音条
                <div
                  className="bubble bubble-user"
                  onClick={() => playUserVoice(msg.audioUrl)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{msg.content}"</span>
                  <span
                    style={{
                      transform: 'rotate(180deg)',
                      display: 'inline-block',
                    }}
                  >
                    📶
                  </span>
                </div>
              )
            ) : (
              // 渲染 AI 文本
              <div className="bubble bubble-ai">
                {msg.isNew ? (
                  <TypewriterText text={msg.content} />
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 全屏图片预览浮层 */}
      {previewImage && (
        <div
          className="image-preview-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="全屏预览" />
        </div>
      )}
    </>
  );
}
