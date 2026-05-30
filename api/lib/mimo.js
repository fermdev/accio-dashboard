const MIMO_CHAT_URL =
  process.env.MIMO_API_URL ||
  'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions';

const DEFAULT_MODEL = process.env.MIMO_MODEL || 'mimo-v2.5-pro';

import { buildAccessContext } from './accessContext.js';
import { getCasualGreetingReply, isCasualGreeting } from './greeting.js';

const ACCIO_SYSTEM_PROMPT = `You are Accio AI, a helpful assistant inside the Accio dashboard for the Access Protocol ecosystem on Solana.
You help creators and stakers understand Access Protocol, staking, campaigns, and on-chain analytics.
You receive live data from the Access Protocol Hub API (go-api.accessprotocol.co) injected below when relevant.

Response rules:
- For casual greetings only (gm, hi, halo): reply in 1–2 short sentences — mirror their greeting, then ask what you can help with. No lists, no protocol overview, no stats.
- For real questions: answer that topic only. Be concise unless they ask for detail. Use live data when present; do not invent pool stats. If live data lists a creator, they exist on Access Protocol — do not say they are missing.
- Match the user's language. Use clean Markdown without backslash escapes when formatting longer answers.`;

export async function createChatCompletion({ messages, model }) {
  const apiKey = process.env.MIMO_API_KEY;
  if (!apiKey) {
    const err = new Error(
      'MIMO_API_KEY is not configured. Add it to your server environment variables.'
    );
    err.statusCode = 503;
    throw err;
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');

  if (lastUser?.content && isCasualGreeting(lastUser.content)) {
    return {
      role: 'assistant',
      content: getCasualGreetingReply(lastUser.content),
      model: model || DEFAULT_MODEL,
    };
  }

  let accessContext = '';
  if (lastUser?.content) {
    try {
      accessContext = await buildAccessContext(lastUser.content);
    } catch (e) {
      console.warn('[Accio] Access context failed:', e.message);
    }
  }

  const systemContent = accessContext
    ? `${ACCIO_SYSTEM_PROMPT}\n\n---\n${accessContext}`
    : ACCIO_SYSTEM_PROMPT;

  const withoutSystem = messages.filter((m) => m.role !== 'system');
  const payloadMessages = [{ role: 'system', content: systemContent }, ...withoutSystem];

  const response = await fetch(MIMO_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      messages: payloadMessages,
      max_completion_tokens: 2048,
      temperature: 0.7,
      top_p: 0.95,
      stream: false,
      thinking: { type: 'disabled' },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(
      data?.error?.message || data?.message || `MiMo API error (${response.status})`
    );
    err.statusCode = response.status;
    throw err;
  }

  const choice = data?.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error('Empty response from MiMo API');
  }

  return {
    role: choice.message.role || 'assistant',
    content: choice.message.content,
    model: data.model || model || DEFAULT_MODEL,
  };
}
