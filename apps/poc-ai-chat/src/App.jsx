import React, { useState, useRef, useEffect } from 'react';
import { useGeminiChat } from './hooks/useGeminiChat';
import ChatHeader from './components/layout/ChatHeader';
import SessionSidebar from './components/sidebar/SessionSidebar';
import MessageItem from './components/chat/MessageItem';
import ChatInput from './components/chat/ChatInput';
import KeyModal from './components/modals/KeyModal';
import ConfirmModal from './components/modals/ConfirmModal';

export default function App() {
  const {
    apiKey,
    tempKey,
    setTempKey,
    showKeyModal,
    setShowKeyModal,
    showConfirmChange,
    setShowConfirmChange,
    sessions,
    activeSessionId,
    setActiveSessionId,
    currentSession,
    typingMap,
    errorMessage,
    handleNewSession,
    handleDeleteSession,
    handleSendMessage,
    applyKeySave
  } = useGeminiChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);
  const isCurrentTyping = !!typingMap[currentSession.id];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isCurrentTyping]);

  const handleSaveAttempt = () => {
    const clean = tempKey.trim();
    if (clean !== apiKey && sessions.some(s => s.messages.length > 1)) {
      setShowConfirmChange(true);
      return;
    }
    applyKeySave(clean, false);
  };

  return (
    <div className="flex h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden relative">
      <SessionSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        typingMap={typingMap}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatHeader
          apiKey={apiKey}
          title={currentSession.title}
          isTyping={isCurrentTyping}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenKeyModal={() => { setTempKey(apiKey); setShowKeyModal(true); }}
          onResetSession={handleNewSession}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-3xl w-full mx-auto">
          {currentSession?.messages?.map(m => (
            <MessageItem key={m.id} message={m} />
          ))}
          {isCurrentTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="animate-pulse">Gemini가 실시간 응답을 생성하고 있습니다...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <ChatInput
          isTyping={isCurrentTyping}
          hasKey={!!apiKey}
          sessionTitle={currentSession.title}
          errorMessage={errorMessage}
          onOpenKeyModal={() => { setTempKey(apiKey); setShowKeyModal(true); }}
          onSendMessage={handleSendMessage}
        />
      </div>

      <KeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        apiKey={apiKey}
        tempKey={tempKey}
        onChangeTempKey={setTempKey}
        onSaveKey={handleSaveAttempt}
        onRemoveKey={() => applyKeySave('', false)}
      />

      <ConfirmModal
        isOpen={showConfirmChange}
        onConfirmReset={() => applyKeySave(tempKey.trim(), true)}
        onConfirmKeep={() => applyKeySave(tempKey.trim(), false)}
      />
    </div>
  );
}
