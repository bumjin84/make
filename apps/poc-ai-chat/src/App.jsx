import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, ArrowLeft, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '안녕하세요! **AI Chat UI 샌드박스**입니다.\n모바일 가상 키보드 대응 및 스트리밍 타이핑 효과가 적용되어 있습니다. 무엇이든 질문해 보세요!',
      code: null
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const newMsg = { id: Date.now(), role: 'user', content: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // AI 스트리밍 타이핑 시뮬레이션
    setTimeout(() => {
      const responseTemplate = `"${userText}"에 대한 답변입니다.\nMake 모노레포의 반응형 AI 챗 컴포넌트가 정상적으로 스트리밍 렌더링 중입니다.`;
      const sampleCode = `// Vite Multi-App Subpath Config\nexport default defineConfig({\n  base: '/make/poc-ai-chat/',\n});`;

      const aiMsgId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'assistant',
        content: responseTemplate,
        code: userText.toLowerCase().includes('코드') || userText.toLowerCase().includes('code') ? sampleCode : null
      }]);
      setIsTyping(false);
    }, 700);
  };

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: '대화가 초기화되었습니다. 새로운 질문을 입력해 주세요!',
        code: null
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <header className="h-14 shrink-0 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between z-10 backdrop-blur">
        <a 
          href="../"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Portal로 돌아가기</span>
        </a>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Chat Sandbox</span>
          </div>
          <button
            onClick={resetChat}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="대화 초기화"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400 border border-slate-750'
            }`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] sm:max-w-md md:max-w-lg rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-xs' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs'
            }`}>
              <p className="whitespace-pre-wrap">{m.content}</p>

              {m.code && (
                <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-[11px]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <span>JavaScript</span>
                    <button 
                      onClick={() => copyCode(m.code, m.id)}
                      className="flex items-center gap-1 hover:text-white text-[10px]"
                    >
                      {copiedId === m.id ? (
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
                  <pre className="p-3 text-emerald-300 overflow-x-auto">
                    <code>{m.code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
            <span className="animate-pulse">AI가 응답을 생성하고 있습니다...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area (Mobile Viewport Optimized) */}
      <footer className="shrink-0 p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 max-w-3xl w-full mx-auto">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요 (예: '코드 예제 보여줘')"
            className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-3 rounded-xl transition-all shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}

