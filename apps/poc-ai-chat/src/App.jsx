import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Key, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  AlertCircle,
  X,
  HelpCircle,
  Trash2,
  Menu,
  Plus,
  MessageSquare,
  ChevronLeft,
  Loader2
} from 'lucide-react';

const MAX_HISTORY = 30; // 세션당 최대 보관 메시지 수

export default function App() {
  // 1. API Key 상태
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmChange, setShowConfirmChange] = useState(false);

  // 2. 세션별 독립 타이핑 상태 매핑 (예: { "session-1": true, "session-2": true })
  const [typingMap, setTypingMap] = useState({});

  // 3. 멀티 세션 상태 관리
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
    } catch (e) {
      console.error('Failed to load sessions:', e);
    }
    const keyExists = !!localStorage.getItem('gemini_api_key');
    return [createDefaultSession(keyExists)];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return sessions[0]?.id || '';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);

  // 현재 활성 세션 및 타이핑 여부
  const currentSession = useMemo(() => {
    return sessions.find(s => s.id === activeSessionId) || sessions[0] || createDefaultSession(!!apiKey);
  }, [sessions, activeSessionId, apiKey]);

  const isCurrentSessionTyping = !!typingMap[currentSession.id];

  // 세션 데이터 로컬 스토리지 자동 저장 (진행 중인 백그라운드 스트리밍 반영)
  useEffect(() => {
    try {
      localStorage.setItem('gemini_chat_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions:', e);
    }
  }, [sessions]);

  // 대화 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isCurrentSessionTyping]);

  // 새 대화 세션 생성
  const handleNewSession = () => {
    const newSession = createDefaultSession(!!apiKey);
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false);
    setErrorMessage('');
  };

  // 세션 삭제
  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    // 현재 세션 타이핑 맵에서도 제거
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

  // API Key 저장 및 확인
  const handleAttemptSaveKey = () => {
    const cleanKey = tempKey.trim();
    if (cleanKey !== apiKey && sessions.some(s => s.messages.length > 1)) {
      setShowConfirmChange(true);
      return;
    }
    applyKeySave(cleanKey, false);
  };

  const applyKeySave = (newKey, shouldResetAllSessions) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem('gemini_api_key', newKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }

    if (shouldResetAllSessions) {
      const freshSession = createDefaultSession(!!newKey);
      setSessions([freshSession]);
      setActiveSessionId(freshSession.id);
      setTypingMap({});
    }

    setShowConfirmChange(false);
    setShowKeyModal(false);
    setErrorMessage('');
  };

  const handleRemoveKey = () => {
    setTempKey('');
    applyKeySave('', false);
  };

  // 메시지 전송 핸들러 (세션별 독립 비동기 스트리밍)
  const handleSend = async () => {
    if (!input.trim() || isCurrentSessionTyping) return;

    const userText = input.trim();
    const targetSessionId = currentSession.id; // 전송 대상 세션 ID 고정
    const userMsg = { id: Date.now(), role: 'user', content: userText };
    const sessionMessages = currentSession.messages || [];

    const isFirstQuestion = sessionMessages.filter(m => m.role === 'user').length === 0;
    const newTitle = isFirstQuestion ? userText.slice(0, 24) : currentSession.title;

    const updatedMessages = [...sessionMessages.slice(-(MAX_HISTORY - 1)), userMsg];

    // 해당 세션 메시지 즉시 업데이트 및 타이핑 상태 켜기
    setSessions(prev => prev.map(s => {
      if (s.id === targetSessionId) {
        return {
          ...s,
          title: newTitle,
          updatedAt: Date.now(),
          messages: updatedMessages
        };
      }
      return s;
    }));

    setInput('');
    setErrorMessage('');
    // 해당 세션 단독 타이핑 활성화
    setTypingMap(prev => ({ ...prev, [targetSessionId]: true }));

    // 1. 실제 Gemini API 스트리밍 호출
    if (apiKey) {
      const assistantMsgId = Date.now() + 1;
      
      setSessions(prev => prev.map(s => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            messages: [...updatedMessages, { id: assistantMsgId, role: 'assistant', content: '' }]
          };
        }
        return s;
      }));

      try {
        const contents = updatedMessages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
              }
            })
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `API 요청 실패 (${response.status})`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6);
              try {
                const parsed = JSON.parse(jsonStr);
                const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
                accumulatedText += chunk;

                // 백그라운드에서도 targetSessionId에 정확히 누적
                setSessions(prev => prev.map(s => {
                  if (s.id === targetSessionId) {
                    return {
                      ...s,
                      messages: s.messages.map(m => 
                        m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                      )
                    };
                  }
                  return s;
                }));
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.error('Gemini API Error:', err);
        setErrorMessage(err.message || 'Gemini API 호출 중 오류가 발생했습니다.');
        setSessions(prev => prev.map(s => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: s.messages.map(m => 
                m.id === assistantMsgId 
                  ? { ...m, content: `⚠️ **오류 발생**: ${err.message}\nAPI Key 상태를 확인해 주세요.` } 
                  : m
              )
            };
          }
          return s;
        }));
      } finally {
        // 해당 세션 타이핑 종료
        setTypingMap(prev => {
          const next = { ...prev };
          delete next[targetSessionId];
          return next;
        });
      }
    } 
    // 2. Mock 모드 시뮬레이션
    else {
      setTimeout(() => {
        setSessions(prev => prev.map(s => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: [
                ...updatedMessages,
                {
                  id: Date.now() + 1,
                  role: 'assistant',
                  content: `[Mock 응답] "${userText}"에 대한 답변입니다.\n\n각 대화방은 독립적으로 동시에 질문을 보낼 수 있습니다. 실제 LLM과 대화하려면 **🔑 키 버튼**을 눌러주세요!`
                }
              ]
            };
          }
          return s;
        }));
        setTypingMap(prev => {
          const next = { ...prev };
          delete next[targetSessionId];
          return next;
        });
      }, 700);
    }
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetCurrentSession = () => {
    if (currentSession.messages.length > 1 && !window.confirm('현재 대화방의 내용을 초기화하시겠습니까?')) {
      return;
    }
    const fresh = createDefaultSession(!!apiKey);
    setSessions(prev => prev.map(s => s.id === currentSession.id ? { ...s, title: '새로운 대화', messages: fresh.messages } : s));
    setErrorMessage('');
  };

  const renderMessageContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const firstLineEnd = part.indexOf('\n');
        const lang = firstLineEnd > 3 ? part.slice(3, firstLineEnd).trim() : 'code';
        const code = firstLineEnd !== -1 ? part.slice(firstLineEnd + 1, -3) : part.slice(3, -3);
        const codeId = `code-${idx}`;

        return (
          <div key={idx} className="my-2.5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-[11px]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 text-slate-400 border-b border-slate-800">
              <span className="uppercase text-[10px] tracking-wider text-slate-400">{lang || 'Code'}</span>
              <button 
                onClick={() => copyText(code, codeId)}
                className="flex items-center gap-1 hover:text-white text-[10px] transition-colors"
              >
                {copiedId === codeId ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-emerald-300 overflow-x-auto whitespace-pre">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return <span key={idx} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className="flex h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* 1. Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* 2. Sessions Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 sm:w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-14 p-3 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={handleNewSession}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>새 대화 시작</span>
          </button>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden ml-2 p-2 text-slate-400 hover:text-white rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            대화 목록 ({sessions.length})
          </div>

          {sessions.map(s => {
            const isActive = s.id === activeSessionId;
            const isTyping = !!typingMap[s.id];

            return (
              <div
                key={s.id}
                onClick={() => { setActiveSessionId(s.id); setIsSidebarOpen(false); }}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                  isActive 
                    ? 'bg-slate-800 text-white font-medium border border-slate-700 shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {isTyping ? (
                    <div className="relative flex items-center justify-center w-3.5 h-3.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </div>
                  ) : (
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  )}
                  <span className="truncate">{s.title || '새로운 대화'}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isTyping && (
                    <span className="text-[10px] text-blue-400 font-normal shrink-0">생성중</span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className={`opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-slate-500 rounded transition-opacity ${isActive ? 'opacity-100' : ''}`}
                    title="대화방 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>동시 독립 스트리밍 지원</span>
          <span className="font-mono">max {MAX_HISTORY}</span>
        </div>
      </aside>

      {/* 3. Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-14 shrink-0 bg-slate-900/90 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between z-10 backdrop-blur">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              title="대화 목록 열기"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a 
              href="../"
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal</span>
            </a>

            <div className="hidden sm:flex items-center gap-2 max-w-[200px] md:max-w-xs truncate text-xs text-slate-400 font-medium pl-2 border-l border-slate-800">
              <span className="truncate text-slate-300">{currentSession?.title}</span>
              {isCurrentSessionTyping && (
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 shrink-0">
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  <span>응답 작성 중</span>
                </span>
              )}
            </div>
          </div>

          {/* Status Badge & Settings Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setTempKey(apiKey); setShowKeyModal(true); }}
              className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded-full border transition-all active:scale-95 ${
                apiKey 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Key className="w-3 h-3" />
              <span>{apiKey ? 'Gemini 2.5 Live' : 'Mock Mode (키 등록)'}</span>
            </button>

            <button
              onClick={resetCurrentSession}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="현재 대화방 초기화"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* API Key Modal */}
        {showKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                  <Key className="w-4 h-4 text-blue-400" />
                  <span>Google Gemini API Key 설정</span>
                </div>
                <button 
                  onClick={() => setShowKeyModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Gemini API Key</span>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>키 무료 발급</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white pr-10 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] leading-relaxed">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
                  <p>
                    키는 외부 서버로 전송되지 않고 브라우저 <strong>localStorage</strong>에만 보관됩니다. 각 대화방별로 독립된 문맥이 유지됩니다.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {apiKey ? (
                  <button
                    type="button"
                    onClick={handleRemoveKey}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>키 삭제</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleAttemptSaveKey}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                  >
                    저장 및 적용
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Change Confirmation Modal */}
        {showConfirmChange && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3.5">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <span>API Key가 변경되었습니다</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                새로운 API Key가 감지되었습니다. 모든 대화방(세션)을 초기화하고 새로 시작할까요, 아니면 대화방들을 유지할까요?
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => applyKeySave(tempKey.trim(), true)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                >
                  모든 대화방 초기화 후 저장
                </button>
                <button
                  type="button"
                  onClick={() => applyKeySave(tempKey.trim(), false)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  대화방 유지하고 저장
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-3xl w-full mx-auto">
          {currentSession?.messages?.map((m) => (
            <div 
              key={m.id} 
              className={`flex items-start gap-2.5 sm:gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400 border border-slate-750'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-md md:max-w-xl rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-xs shadow-md' 
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs shadow-sm'
              }`}>
                {renderMessageContent(m.content)}
              </div>
            </div>
          ))}

          {isCurrentSessionTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="animate-pulse">Gemini가 실시간 응답을 생성하고 있습니다...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <footer className="shrink-0 p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 max-w-3xl w-full mx-auto">
          {errorMessage && (
            <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{errorMessage}</span>
            </div>
          )}

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            {/* Key Button */}
            <button
              type="button"
              onClick={() => { setTempKey(apiKey); setShowKeyModal(true); }}
              className={`p-3 rounded-xl border transition-colors shrink-0 active:scale-95 ${
                apiKey 
                  ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-500/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-500/30'
              }`}
              title="Gemini API Key 설정"
            >
              <Key className="w-4 h-4" />
            </button>

            {/* Text Input (현재 세션이 타이핑 중일 때만 비활성화) */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isCurrentSessionTyping}
              placeholder={
                isCurrentSessionTyping 
                  ? "현재 대화방에서 답변을 생성 중입니다..." 
                  : apiKey 
                    ? `[${currentSession?.title}]에 질문하기...` 
                    : "질문을 입력하세요 (키 미등록 시 Mock)"
              }
              className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:border-blue-500 placeholder:text-slate-500 disabled:opacity-50"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isCurrentSessionTyping}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-3 rounded-xl transition-all shrink-0 active:scale-95 shadow-md shadow-blue-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
