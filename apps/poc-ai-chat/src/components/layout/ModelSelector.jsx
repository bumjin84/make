import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { GEMINI_MODELS, getModelInfo } from '../../utils/geminiModels';

export default function ModelSelector({ selectedModel, onSelectModel, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const currentModel = getModelInfo(selectedModel);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (modelId) => {
    onSelectModel(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* 모델 선택 버튼 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
          isOpen
            ? 'bg-slate-800 text-white border-blue-500/50 ring-1 ring-blue-500/30'
            : 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-slate-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
        title="Gemini AI 모델 변경"
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="hidden xs:inline sm:inline truncate max-w-[110px] sm:max-w-none">
          {currentModel.name}
        </span>
        <span className="inline xs:hidden sm:hidden font-mono text-[11px]">
          {currentModel.shortName}
        </span>
        <span className={`hidden md:inline-block text-[10px] px-1.5 py-0.2 rounded border font-normal ${currentModel.badgeColor}`}>
          {currentModel.badge}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 모델 선택 드롭다운 팝업 (말주머니) */}
      {isOpen && (
        <div className="fixed sm:absolute top-14 sm:top-full left-3 sm:left-0 right-3 sm:right-auto mt-1 sm:mt-2 sm:w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/80 z-50 p-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* 말주머니 상단 꼬리 팁 (데스크톱) */}
          <div className="hidden sm:block absolute -top-1.5 left-6 w-3 h-3 bg-slate-900 border-t border-l border-slate-800 rotate-45" />

          <div className="relative px-3 py-2 border-b border-slate-800/80 mb-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Gemini AI 모델 선택
            </p>
          </div>

          <div className="space-y-1">
            {GEMINI_MODELS.map((model) => {
              const isSelected = model.id === selectedModel;
              return (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model.id)}
                  className={`w-full flex items-start justify-between gap-2 p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-blue-600/15 border border-blue-500/30 text-white'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold truncate">{model.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-medium shrink-0 ${model.badgeColor}`}>
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {model.description}
                    </p>
                  </div>

                  <div className="pt-0.5 shrink-0">
                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

