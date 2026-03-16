import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext, type ChatMessage } from './AppContext';
import { MOCK_DATA } from './mockData';

// 引入拆分后的两个 Modal 组件
import InitialReportModal from './InitialReportModal';
import CourseReportModal from './CourseReportModal';

export default function Chat() {
  const { stage } = useParams<{ stage: string }>();
  const navigate = useNavigate();
  const { chatMemory, updateChatMemory, reportStatus, unlockReport } =
    useAppContext();

  const script =
    MOCK_DATA.scripts[stage as keyof typeof MOCK_DATA.scripts] || [];
  const [messages, setMessages] = useState<ChatMessage[]>(
    chatMemory[stage as string] || [],
  );
  const [scriptIndex, setScriptIndex] = useState(
    chatMemory[stage as string]?.length || 0,
  );

  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [inputText, setInputText] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [messages, typingText]);

  useEffect(() => {
    if (stage) updateChatMemory(stage, messages);
  }, [messages, stage]);

  useEffect(() => {
    if (scriptIndex >= script.length) return;
    const currentAct = script[scriptIndex];

    if (currentAct.role === 'ai') {
      setIsTyping(true);
      setTypingText('');
      let charIndex = 0;
      const timer = setInterval(() => {
        setTypingText(currentAct.content.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex >= currentAct.content.length) {
          clearInterval(timer);
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: 'ai',
              content: currentAct.content,
            },
          ]);
          setScriptIndex((prev) => prev + 1);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [scriptIndex]);

  // 【核心修改点】处理用户发送
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // 拦截空输入和非用户回合
    if (scriptIndex >= script.length || isTyping || inputText.trim() === '')
      return;

    const currentAct = script[scriptIndex];
    if (currentAct.role === 'user') {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'user',
          // 之前是 currentAct.content，现在改成用户真实输入的内容
          content: inputText.trim(),
        },
      ]);
      // 剧本索引 +1，这样即使输入不一样，AI也会吐出剧本的下一句话
      setScriptIndex((prev) => prev + 1);
      setInputText(''); // 清空输入框
    }
  };

  const handleGenerateReport = () => {
    if (stage) unlockReport(stage as keyof typeof reportStatus);
  };

  const isReportGenerated = reportStatus[stage as keyof typeof reportStatus];
  const isUserTurn =
    !isTyping &&
    scriptIndex < script.length &&
    script[scriptIndex]?.role === 'user';

  const titleMap: Record<string, string> = {
    initial: '通灵老师 - 初认识画像',
    pre: '第16节 正态分布 - 课前预习',
    in: '第16节 正态分布 - 课中学习',
    post: '第16节 正态分布 - 课后拓展',
  };

  return (
    <div className="chat-layout">
      <main className="chat-main">
        <header className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-outline"
              style={{ padding: '6px 12px', border: 'none' }}
              onClick={() => navigate('/home')}
            >
              ← 返回主页
            </button>
            <h2 style={{ fontSize: '18px', color: 'var(--primary)' }}>
              {titleMap[stage || 'pre']}
            </h2>
          </div>
        </header>

        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`msg-row ${msg.role}`}>
              {/* 核心修改：统一把头像写在气泡前面。
                  如果是 user，CSS 的 flex-direction: row-reverse 会自动把它翻转到最右边 */}
              <div className={`avatar avatar-${msg.role}`}>
                {msg.role === 'ai' ? '通' : '我'}
              </div>

              <div className={`bubble bubble-${msg.role}`}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} style={{ minHeight: '1em' }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="msg-row ai">
              <div className="avatar avatar-ai">通</div>
              <div className="bubble bubble-ai">
                {typingText.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
                <span className="cursor-blink"></span>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-area">
          {!isReportGenerated ? (
            <>
              <form className="chat-input-form" onSubmit={handleSend}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder={
                    isUserTurn ? '请输入你的回答...' : '请等待老师回复...'
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={!isUserTurn}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!isUserTurn || inputText.trim() === ''}
                >
                  发送
                </button>
              </form>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-outline"
                  onClick={handleGenerateReport}
                  style={{ borderColor: '#00d084', color: '#00d084' }}
                >
                  ✨ 结束对话并生成报告
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                animation: 'fadeIn 0.5s',
              }}
            >
              <button
                className="btn-primary"
                onClick={() => setShowReportModal(true)}
              >
                📊 立刻查看报告
              </button>
              <button className="btn-outline" onClick={() => navigate('/home')}>
                返回学习主页
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 核心判断：如果处于初认识阶段，就展示表格 Modal；如果是课程阶段，就展示带折线图的课程 Modal */}
      {showReportModal &&
        (stage === 'initial' ? (
          <InitialReportModal onClose={() => setShowReportModal(false)} />
        ) : (
          <CourseReportModal
            onClose={() => setShowReportModal(false)}
            defaultTab={stage}
          />
        ))}
    </div>
  );
}
