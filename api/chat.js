import { createChatCompletion } from './lib/mimo.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const validRoles = new Set(['user', 'assistant', 'system']);
    for (const msg of messages) {
      if (!validRoles.has(msg.role) || typeof msg.content !== 'string') {
        return res.status(400).json({ error: 'Invalid message format' });
      }
    }

    const reply = await createChatCompletion({ messages, model });
    return res.status(200).json({ message: reply });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message || 'Chat request failed' });
  }
}
