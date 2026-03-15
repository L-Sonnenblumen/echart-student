import { useState, useRef, ChangeEvent } from 'react';

interface TalkProps {
  // 统一回调，支持发送 'voice' 或 'image'
  onSendMessage: (payload: {
    type: 'voice' | 'image';
    content: string;
    url?: string;
  }) => void;
  disabled?: boolean;
}

export default function Talk({ onSendMessage, disabled }: TalkProps) {
  const [isRecording, setIsRecording] = useState(false);
  const startTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 处理录音逻辑 ---
  const handleToggleRecord = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (isRecording) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/webm',
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          const duration = Math.max(
            1,
            Math.min(
              Math.floor((Date.now() - startTimeRef.current) / 1000),
              60,
            ),
          );

          onSendMessage({
            type: 'voice',
            content: duration.toString(),
            url: audioUrl,
          });
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        startTimeRef.current = Date.now();

        if (window.speechSynthesis)
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
      } catch (err) {
        alert('请允许网页访问麦克风权限后再试！');
      }
    }
  };

  // --- 处理图片选择逻辑 ---
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onSendMessage({ type: 'image', content: '[图片]', url: imageUrl });
    }
    // 重置 input，允许重复选择同一张图片
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="talk-area">
      {/* 录音波浪指示器 */}
      <div className={`record-indicator ${isRecording ? 'show' : ''}`}>
        <div className="voice-waves">
          <div className="wave-bar" style={{ backgroundColor: 'white' }}></div>
          <div className="wave-bar" style={{ backgroundColor: 'white' }}></div>
          <div className="wave-bar" style={{ backgroundColor: 'white' }}></div>
          <div className="wave-bar" style={{ backgroundColor: 'white' }}></div>
        </div>
        <span style={{ fontSize: 14, fontWeight: 500 }}>
          录音中... 点击发送
        </span>
      </div>

      {/* 底部横向布局容器 */}
      <div className="talk-container">
        {/* 隐藏的文件输入框 */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageSelect}
        />
        {/* 语音按钮 */}
        <button
          className={`record-btn ${isRecording ? 'recording' : ''}`}
          onClick={handleToggleRecord}
          disabled={disabled && !isRecording} // 如果AI正在回答且没在录音，禁用
        >
          <span style={{ fontSize: 18 }}>{isRecording ? '🎙️' : '🎤'}</span>
          {isRecording ? '点击 发送' : '点击 说话'}
        </button>
        {/* 新增：相册/图片按钮 */}
        <button
          className="img-upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isRecording}
        >
          🌄
        </button>
      </div>
    </div>
  );
}
