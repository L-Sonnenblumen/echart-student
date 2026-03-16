import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

export interface ReportStatus {
  initial: boolean;
  pre: boolean;
  in: boolean;
  post: boolean;
}

interface AppContextType {
  user: { name: string; id: string } | null;
  setUser: (user: { name: string; id: string } | null) => void;

  chatMemory: Record<string, ChatMessage[]>;
  updateChatMemory: (stage: string, messages: ChatMessage[]) => void;

  reportStatus: ReportStatus;
  unlockReport: (stage: keyof ReportStatus) => void;

  activeChapter: string | null;
  setActiveChapter: (chapter: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const [chatMemory, setChatMemory] = useState<Record<string, ChatMessage[]>>({
    initial: [],
    pre: [],
    in: [],
    post: [],
  });
  const [reportStatus, setReportStatus] = useState<ReportStatus>({
    initial: false,
    pre: false,
    in: false,
    post: false,
  });

  // 核心修改：默认值设为 null，强迫用户去点击左侧目录
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  const updateChatMemory = (stage: string, messages: ChatMessage[]) => {
    setChatMemory((prev) => ({ ...prev, [stage]: messages }));
  };

  const unlockReport = (stage: keyof ReportStatus) => {
    setReportStatus((prev) => ({ ...prev, [stage]: true }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        chatMemory,
        updateChatMemory,
        reportStatus,
        unlockReport,
        activeChapter,
        setActiveChapter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext必须在AppProvider内部使用');
  return context;
};
