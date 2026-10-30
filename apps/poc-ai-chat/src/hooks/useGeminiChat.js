import { useState, useEffect, useMemo } from 'react';
import { streamGeminiChat } from '../utils/geminiApi';

const MAX_HISTORY = 30;

export function useGeminiChat() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showConfirmChange, setShowConfirmChange] = useState(false);
  const [typingMap, setTypingMap] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const createDefaultSession = (hasKey) => ({
    id: `session-${Date.now()}`,
    title: '새로운 대화',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [
      {
        id: 1,
        role: 'assistant',
        content: hasKey 
          ? '안녕하세요! **Google Gemini 2.5 Flash** 실시간 대화 모드입니다. 무엇이든 질문해 보세요!'
          : '안녕하세요! **AI Chat Sandbox**입니다.\nGemini API Key를 등록하시면 실제 LLM과 실시간 스트리밍 대화를 나눌 수 있습니다. (키 미등록 시 Mock 모드)'
      }
    ]
  });

  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('gemini_chat_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [createDefaultSession(!!localStorage.getItem('gemini_api_key'))];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]?.id || '');

  const currentSession = useMemo(() => {
    return sessions.find(s => s.id === activeSessionId) || sessions[0] || createDefaultSession(!!apiKey);
  }, [sessions, activeSessionId, apiKey]);

  useEffect(() => {
    try {
      localStorage.setItem('gemini_chat_sessions', JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  const handleNewSession = () => {
    const fresh = createDefaultSession(!!apiKey);
    setSessions(prev => [fresh, ...prev]);
    setActiveSessionId(fresh.id);
    setErrorMessage('');
  };

  const handleDeleteSession = (sessionId, e) => {
    e?.stopPropagation();
    setTypingMap(prev => {
      const next = { ...prev };
      delete next[sessionId];
      return next;
    });

    if (sessions.length === 1) {
      const reset = createDefaultSession(!!apiKey);
      setSessions([reset]);
      setActiveSessionId(reset.id);
      return;
    }

    const filtered = sessions.filter(s => s.id !== sessionId);
    setSessions(filtered);
    if (activeSessionId === sessionId) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const handleSendMessage = async (text) => {
    const targetSessionId = currentSession.id;
    const userMsg = { id: Date.now(), role: 'user', content: text };
    const sessionMessages = currentSession.messages || [];

    const isFirst = sessionMessages.filter(m => m.role === 'user').length === 0;
    const newTitle = isFirst ? text.slice(0, 24) : currentSession.title;
    const updatedMessages = [...sessionMessages.slice(-(MAX_HISTORY - 1)), userMsg];

    setSessions(prev => prev.map(s => s.id === targetSessionId ? { ...s, title: newTitle, updatedAt: Date.now(), messages: updatedMessages } : s));
    setTypingMap(prev => ({ ...prev, [targetSessionId]: true }));
    setErrorMessage('');

    if (apiKey) {
      const assistantMsgId = Date.now() + 1;
      setSessions(prev => prev.map(s => s.id === targetSessionId ? { ...s, messages: [...updatedMessages, { id: assistantMsgId, role: 'assistant', content: '' }] } : s));

      try {
        await streamGeminiChat({
          apiKey,
          messages: updatedMessages,
          onChunk: (accumulated) => {
            setSessions(prev => prev.map(s => s.id === targetSessionId ? {
              ...s,
              messages: s.messages.map(m => m.id === assistantMsgId ? { ...m, content: accumulated } : m)
            } : s));
          }
        });
      } catch (err) {
        setErrorMessage(err.message || 'Gemini API 호출 오류');
        setSessions(prev => prev.map(s => s.id === targetSessionId ? {
          ...s,
          messages: s.messages.map(m => m.id === assistantMsgId ? { ...m, content: `⚠️ 오류: ${err.message}` } : m)
        } : s));
      } finally {
        setTypingMap(prev => {
          const next = { ...prev };
          delete next[targetSessionId];
          return next;
        });
      }
    } else {
      setTimeout(() => {
        setSessions(prev => prev.map(s => s.id === targetSessionId ? {
          ...s,
          messages: [
            ...updatedMessages,
            {
              id: Date.now() + 1,
              role: 'assistant',
              content: `[Mock 응답] "${text}"에 대한 답변입니다.\n실제 LLM과 대화하려면 **🔑 키 버튼**을 눌러주세요!`
            }
          ]
        } : s));
        setTypingMap(prev => {
          const next = { ...prev };
          delete next[targetSessionId];
          return next;
        });
      }, 700);
    }
  };

  const applyKeySave = (newKey, shouldReset) => {
    setApiKey(newKey);
    if (newKey) localStorage.setItem('gemini_api_key', newKey);
    else localStorage.removeItem('gemini_api_key');

    if (shouldReset) {
      const fresh = createDefaultSession(!!newKey);
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
      setTypingMap({});
    }
    setShowConfirmChange(false);
    setShowKeyModal(false);
  };

  return {
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
  };
}
