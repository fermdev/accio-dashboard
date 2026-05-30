import { useCallback, useEffect, useState } from 'react';
import { MIMO_DEFAULT_MODEL } from '../constants/mimoModels';

const STORAGE_KEY = 'accio-chat-sessions';

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function createSession() {
  return {
    id: crypto.randomUUID(),
    title: 'New chat',
    createdAt: Date.now(),
    messages: [],
  };
}

export function useAccioChat() {
  const [sessions, setSessions] = useState(loadSessions);
  const [activeId, setActiveId] = useState(() => loadSessions()[0]?.id ?? null);
  const [model, setModel] = useState(MIMO_DEFAULT_MODEL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const activeSession =
    sessions.find((s) => s.id === activeId) ?? sessions[0] ?? null;

  const messages = activeSession?.messages ?? [];

  const startNewChat = useCallback(() => {
    const session = createSession();
    setSessions((prev) => [session, ...prev]);
    setActiveId(session.id);
    setError(null);
    return session.id;
  }, []);

  const ensureActiveSession = useCallback(() => {
    if (activeSession) return activeSession.id;
    return startNewChat();
  }, [activeSession, startNewChat]);

  const deleteSession = useCallback(
    (id) => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (activeId === id) {
          setActiveId(next[0]?.id ?? null);
        }
        return next;
      });
    },
    [activeId]
  );

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const sessionId = ensureActiveSession();
      const userMessage = { role: 'user', content: trimmed, id: crypto.randomUUID() };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const nextMessages = [...s.messages, userMessage];
          const title =
            s.messages.length === 0 ? trimmed.slice(0, 42) : s.title;
          return { ...s, messages: nextMessages, title };
        })
      );
      setIsLoading(true);
      setError(null);

      const prior = sessions.find((s) => s.id === sessionId)?.messages ?? [];
      const apiMessages = [...prior, { role: 'user', content: trimmed }].map(
        ({ role, content }) => ({ role, content })
      );

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages, model }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to get response');
        }

        const assistantMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message.content,
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, assistantMessage] }
              : s
          )
        );
      } catch (err) {
        setError(err.message);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: s.messages.filter((m) => m.id !== userMessage.id) }
              : s
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [ensureActiveSession, isLoading, model, sessions]
  );

  useEffect(() => {
    if (sessions.length === 0) {
      startNewChat();
    } else if (!activeId) {
      setActiveId(sessions[0].id);
    }
  }, [sessions.length, activeId, startNewChat]);

  return {
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
  };
}
