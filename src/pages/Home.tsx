import { useState, useEffect } from 'react';
import Header from './Header';
import Panel, { type Message } from './Panel';
import Talk from './Talk';
import { MOCK_DATA } from './mockData';

export default function Home() {
  const studentId = '101';
  const script =
    MOCK_DATA.scripts[studentId as keyof typeof MOCK_DATA.scripts] || [];

  const [scriptIndex, setScriptIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'ai',
      type: 'text',
      content:
        '同学你好，准备好开始情景对话了吗？你可以点击语音或发送图片回复我。',
      isNew: false,
    },
  ]);
  const [isAiAnswering, setIsAiAnswering] = useState(false);

  // 组件卸载时停止一切语音播报
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // AI TTS 播报
  const playAiVoice = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  // 💡 统一处理用户发出的内容（语音或图片），这里就是报错里找不到的那个函数
  const handleSendMessage = (payload: {
    type: 'voice' | 'image';
    content: string;
    url?: string;
  }) => {
    // 1. 在面板上渲染用户的消息
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      type: payload.type,
      content: payload.content,
      audioUrl: payload.type === 'voice' ? payload.url : undefined,
      imageUrl: payload.type === 'image' ? payload.url : undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAiAnswering(true); // 锁定底部按钮

    // 2. 模拟网络延迟和获取剧本回复
    setTimeout(() => {
      let aiText = '';
      if (scriptIndex < script.length) {
        aiText = script[scriptIndex].answer;
        setScriptIndex((prev) => prev + 1);
      } else {
        aiText = '本次情景演练已结束，表现不错！';
      }

      playAiVoice(aiText);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        type: 'text',
        content: aiText,
        isNew: true,
      };

      setMessages((prev) => {
        const updatedPrev = prev.map((m) =>
          m.role === 'ai' ? { ...m, isNew: false } : m,
        );
        return [...updatedPrev, aiMsg];
      });
      setIsAiAnswering(false); // 解锁底部按钮
    }, 800); // 假装思考 0.8 秒
  };

  return (
    <div className="chat-wrapper">
      <Header title="情景对话演练" />
      <Panel messages={messages} />

      {/* 💡 这里将属性名改为了 onSendMessage */}
      <Talk onSendMessage={handleSendMessage} disabled={isAiAnswering} />
    </div>
  );
}
