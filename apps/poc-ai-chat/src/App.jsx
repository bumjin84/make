import React, { useState, useRef, useEffect } from 'react';
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
  X
} from 'lucide-react';

export default function App() {
  // API Key 상태 (로컬 스토리지 보관)
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 대화 메시지 상태
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: apiKey 
        ? '안녕하세요! **Google Gemini 2.5 Flash** 실시간 대화 모드가 활성화되어 있습니다. 무엇이든 질문해 보세요!'
        : '안녕하세요! **AI Chat Sandbox**입니다.\nGemini API Key를 등록하시면 실제 LLM과 실시간 스트리밍 대화를 나눌 수 있습니다. (키가 없어도 Mock 대화가 가능합니다)'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // API Key 저장 / 삭제 핸들러
  const handleSaveKey = () => {
    const cleanKey = tempKey.trim();
    setApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('gemini_api_key', cleanKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    setShowKeyModal(false);
    setErrorMessage('');
  };

  const handleRemoveKey = () => {
    setApiKey('');
    setTempKey('');
    localStorage.removeItem('gemini_api_key');
    setShowKeyModal(false);
  };

  // 메시지 전송 핸들러
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg = { id: Date.now(), role: 'user', content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);
    setErrorMessage('');

    // 1. API Key가 있는 경우 -> 실제 Gemini SSE 스트리밍 호출
    if (apiKey) {
      const assistantMsgId = Date.now() + 1;
      // 어시스턴트 메시지 빈 상태로 생성
      setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

      try {
        // Gemini 히스토리 포맷 변환 (user, model)
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
          buffer = lines.pop() || ''; // 남은 미완성 청크 보관

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6);
              try {
                const parsed = JSON.parse(jsonStr);
                const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
                accumulatedText += chunk;
                
                // 실시간 텍스트 갱신
                setMessages(prev => 
                  prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulatedText } : m)
                );
              } catch (e) {
                // 파싱 에러 무시하고 다음 청크 진행
              }
            }
          }
        }
      } catch (err) {
        console.error('Gemini API Error:', err);
        setErrorMessage(err.message || 'Gemini API 호출 중 오류가 발생했습니다.');
        setMessages(prev => 
          prev.map(m => m.id === assistantMsgId 
            ? { ...m, content: `⚠️ **오류 발생**: ${err.message}\nAPI Key가 올바른지 확인해 주세요.` } 
            : m
          )
        );
      } finally {
        setIsTyping(false);
      }
    } 
    // 2. API Key가 없는 경우 -> Mock 시뮬레이션
    else {
      setTimeout(() => {
        const sampleCode = `// [Mock] Gemini 2.5 Flash API 연동 준비 완료\n// 상단이나 입력창의 🔑 버튼으로 API 키를 등록하면 실제 응답을 받습니다.`;
        setMessages(prev => [
          ...prev, 
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: `[Mock 응답] "${userText}"에 대한 시뮬레이션 답변입니다.\n\n실제 LLM과 대화하시려면 입력창 왼쪽의 **🔑 키 버튼**을 눌러 Gemini API Key를 등록해 주세요!`,
            code: userText.toLowerCase().includes('코드') ? sampleCode : null
          }
        ]);
        setIsTyping(false);
      }, 600);
    }
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: apiKey 
          ? '새로운 대화 세션이 시작되었습니다. 무엇이든 질문해 주세요!' 
          : '대화가 초기화되었습니다. API Key를 등록하시면 실시간 Gemini와 대화할 수 있습니다.',
      }
    ]);
    setErrorMessage('');
  };

  // 텍스트 내 코드 블록 분리 렌더러
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
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-slate-100 relative">
      {/* Top Header */}
      <header className="h-14 shrink-0 bg-slate-900/90 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between z-10 backdrop-blur">
        <a 
          href="../"
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Portal로 돌아가기</span>
          <span className="sm:hidden">Portal</span>
        </a>

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
            onClick={resetChat}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="대화 초기화"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* API Key Modal / Popover */}
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
                  <span>키 무료 발급받기</span>
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
                  입력하신 API Key는 백엔드 서버로 전송되지 않으며, 오직 본인 브라우저의 <strong>localStorage</strong>에만 안전하게 보관됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {apiKey ? (
                <button
                  type="button"
                  onClick={handleRemoveKey}
                  className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-2"
                >
                  키 삭제하기
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
                  onClick={handleSaveKey}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                  저장 및 적용
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.map((m) => (
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

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="animate-pulse">Gemini가 실시간 응답을 생성하고 있습니다...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area (Mobile Viewport & Keyboard Optimized) */}
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
          {/* Key Button (입력창 좌측 원터치 키 관리) */}
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

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={apiKey ? "Gemini에게 질문을 입력하세요..." : "질문을 입력하세요 (키 미등록 시 Mock 대화)"}
            className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm rounded-xl px-3.5 py-3 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-3 rounded-xl transition-all shrink-0 active:scale-95 shadow-md shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}
