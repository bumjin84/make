import { useState, useEffect, useMemo } from 'react';
import { streamGeminiChat } from '../utils/geminiApi';
import { DEFAULT_MODEL, getModelInfo } from '../utils/geminiModels';

const MAX_HISTORY = 30;

export function useGeminiChat() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [selectedModel, setSelectedModel] = useState(() => {
    const saved = localStorage.getItem('gemini_chat_model');
    if (saved === 'gemini-2.5-pro') {
      try { localStorage.setItem('gemini_chat_model', 'gemini-3.1-pro-preview'); } catch {}
      return 'gemini-3.1-pro-preview';
    }
    return saved || DEFAULT_MODEL;
  });
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showConfirmChange, setShowConfirmChange] = useState(false);
  const [typingMap, setTypingMap] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const createDefaultSession = (hasKey, modelId = selectedModel) => {
    const model = getModelInfo(modelId);
    return {
      id: `session-${Date.now()}`,
      title: '새로운 대화',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: 1,
          role: 'assistant',
          content: hasKey 
            ? `안녕하세요! **${model.name}** 실시간 대화 모드입니다. 무엇이든 질문해 보세요!`
            : '안녕하세요! **AI Chat Sandbox**입니다.\nGemini API Key를 등록하시면 실제 LLM과 실시간 스트리밍 대화를 나눌 수 있습니다. (키 미등록 시 Mock 모드)'
        }
      ]
    };
  };

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
          model: selectedModel,
          messages: updatedMessages,
          onChunk: (accumulated) => {
            setSessions(prev => prev.map(s => s.id === targetSessionId ? {
              ...s,
              messages: s.messages.map(m => m.id === assistantMsgId ? { ...m, content: accumulated } : m)
            } : s));
          }
        });
      } catch (err) {
        let errorText = err.message || 'Gemini API 호출 오류';
        if (errorText.includes('Quota exceeded') || errorText.includes('limit: 0') || errorText.includes('free_tier')) {
          errorText = `⚠️ [할당량 안내] 현재 선택된 모델('${getModelInfo(selectedModel).name}')은 Google 무료 API 계정에서 호출 제한(limit: 0)이 적용되어 있습니다.\n무료 티어가 지원되는 **'Gemini 2.5 Flash'** 또는 **'Gemini 2.0 Flash'**로 모델을 변경해 보세요!`;
        } else {
          errorText = `⚠️ 오류: ${errorText}`;
        }
        setErrorMessage(errorText);
        setSessions(prev => prev.map(s => s.id === targetSessionId ? {
          ...s,
          messages: s.messages.map(m => m.id === assistantMsgId ? { ...m, content: errorText } : m)
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
              content: `[Mock 응답 - ${getModelInfo(selectedModel).name}] "${text}"에 대한 답변입니다.\n실제 LLM과 대화하려면 **🔑 키 버튼**을 눌러주세요!`
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

  const handleSelectModel = (modelId) => {
    setSelectedModel(modelId);
    try {
      localStorage.setItem('gemini_chat_model', modelId);
    } catch (e) {}
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
    selectedModel,
    setSelectedModel: handleSelectModel,
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

