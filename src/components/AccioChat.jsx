import React, { useEffect, useRef, useState } from 'react';
import iconLogo from '../assets/iconlogo.PNG';
import { useAccioChat } from '../hooks/useAccioChat';
import { MIMO_MODEL_OPTIONS } from '../constants/mimoModels';
import ChatMarkdown from './ChatMarkdown';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 ${
          isUser
            ? 'bg-primary/20 border border-primary/30'
            : 'bg-white/5 border border-white/10'
        }`}
      >
        {isUser ? (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-slate-900 dark:text-white">
            {message.content}
          </p>
        ) : (
          <ChatMarkdown content={message.content} variant="assistant" />
        )}
      </div>
    </div>
  );
}

const AccioChat = () => {
  const {
    sessions,
    activeId,
    setActiveId,
    messages,
    model,
    setModel,
    isLoading,
    error,
    setError,
    sendMessage,
    startNewChat,
    deleteSession,
  } = useAccioChat();

  const [input, setInput] = useState('');
  const [modelOpen, setModelOpen] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const hasMessages = messages.length > 0;
  const modelLabel = MIMO_MODEL_OPTIONS.find((m) => m.id === model)?.label ?? '2.5 Pro';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const autoResize = (e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="flex flex-1 min-h-0 bg-[#131314] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[72px] flex-col items-center py-4 border-r border-white/5 shrink-0 bg-[#0e0e0f]">
        <div className="size-10 rounded-xl overflow-hidden mb-6">
          <img src={iconLogo} alt="Accio" className="w-full h-full object-contain" />
        </div>

        <button
          type="button"
          onClick={startNewChat}
          title="New chat"
          className="size-11 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors mb-2"
        >
          <span className="material-symbols-outlined">edit_square</span>
        </button>

        <button
          type="button"
          title="History"
          className="size-11 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">history</span>
        </button>

        <div className="flex-1" />

        <button
          type="button"
          title="Settings"
          className="size-11 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-white/10 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </aside>

      {/* Session list (tablet+) */}
      {sessions.length > 0 && (
        <aside className="hidden lg:flex w-56 flex-col border-r border-white/5 bg-[#0e0e0f]/80 shrink-0">
          <div className="p-3">
            <button
              type="button"
              onClick={startNewChat}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              New chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-4 space-y-0.5">
            {sessions.map((s) => (
              <div key={s.id} className="group relative">
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(s.id);
                    setError(null);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm truncate pr-8 transition-colors ${
                    s.id === activeId
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  {s.title}
                </button>
                <button
                  type="button"
                  onClick={() => deleteSession(s.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 size-7 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-white/10"
                  title="Delete chat"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(101, 145, 255, 0.12) 0%, transparent 70%)',
          }}
        />

        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 min-h-full flex flex-col">
            {!hasMessages ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center pb-32">
                <h1 className="text-3xl md:text-4xl font-medium text-slate-100 tracking-tight mb-2">
                  Ask <span className="text-primary font-logo">accio</span>
                </h1>
                <p className="text-slate-500 text-sm max-w-md">
                  Your AI assistant for Access Protocol — powered by Xiaomi MiMo on the backend.
                </p>
              </div>
            ) : (
              <div className="pb-36 pt-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <span className="inline-flex gap-1">
                      <span className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                      <span className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                      <span className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                    </span>
                    Accio is thinking…
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input dock */}
        <div className="relative z-20 px-4 pb-6 md:pb-8 pt-2">
          <div className="max-w-3xl mx-auto">
            {error && (
              <div className="mb-3 flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                <span className="material-symbols-outlined text-lg shrink-0">error</span>
                <span className="flex-1">{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-200"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] bg-[#1e1f20] border border-white/10 shadow-2xl shadow-black/40 focus-within:border-primary/40 transition-colors"
            >
              <div className="flex items-end gap-1 px-2 py-2">
                <button
                  type="button"
                  className="size-10 shrink-0 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="Attach (coming soon)"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>

                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onInput={autoResize}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Accio"
                  disabled={isLoading}
                  className="flex-1 resize-none bg-transparent text-[15px] text-slate-100 placeholder:text-slate-500 py-3 px-1 max-h-40 outline-none disabled:opacity-50"
                />

                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setModelOpen((o) => !o)}
                    className="flex items-center gap-1 px-3 py-2 rounded-full text-sm text-slate-300 hover:bg-white/10 transition-colors"
                  >
                    {modelLabel}
                    <span className="material-symbols-outlined text-lg">expand_more</span>
                  </button>
                  {modelOpen && (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-40"
                        aria-label="Close model menu"
                        onClick={() => setModelOpen(false)}
                      />
                      <div className="absolute bottom-full right-0 mb-2 z-50 min-w-[140px] rounded-xl bg-[#2d2e30] border border-white/10 py-1 shadow-xl">
                        {MIMO_MODEL_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setModel(opt.id);
                              setModelOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 ${
                              model === opt.id ? 'text-primary' : 'text-slate-200'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="size-10 shrink-0 rounded-full flex items-center justify-center bg-primary text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors mr-1"
                  title="Send"
                >
                  <span className="material-symbols-outlined">
                    {input.trim() ? 'send' : 'mic'}
                  </span>
                </button>
              </div>
            </form>

            <p className="text-center text-[11px] text-slate-600 mt-3">
              Accio can make mistakes. Verify important on-chain data independently.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccioChat;
