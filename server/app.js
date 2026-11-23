import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';

import {
  FORUMS,
  getMessagesByForum,
  addMessage,
} from './db.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
}));

app.use(express.json());

// Simulated latency middleware
app.use(async (req, res, next) => {
  try {
    const latency = Number(process.env.SIMULATED_LATENCY_MS) || 0;

    if (latency > 0) {
      await new Promise((resolve) => setTimeout(resolve, latency));
    }

    next();
  } catch {
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

// GET messages
app.get('/api/messages/:forum', async (req, res) => {
  try {
    const { forum } = req.params;

    if (!FORUMS.includes(forum)) {
      return res.status(404).json({
        error: 'Forum not found',
      });
    }

    const messages = getMessagesByForum(forum);

    return res.status(200).json(messages);
  } catch {
    return res.status(500).json({
      error: 'Failed to retrieve messages',
    });
  }
});

// POST message
app.post('/api/messages/:forum', async (req, res) => {
  try {
    const { forum } = req.params;

    // Check forum before validating body.
    if (!FORUMS.includes(forum)) {
      return res.status(404).json({
        error: 'Forum not found',
      });
    }

    const { author, text } = req.body ?? {};

    if (typeof author !== 'string') {
      return res.status(400).json({
        error: 'Author must be a string',
      });
    }

    if (typeof text !== 'string') {
      return res.status(400).json({
        error: 'Text must be a string',
      });
    }

    const trimmedAuthor = author.trim();
    const trimmedText = text.trim();

    if (!trimmedAuthor) {
      return res.status(400).json({
        error: 'Author cannot be empty',
      });
    }

    if (!trimmedText) {
      return res.status(400).json({
        error: 'Text cannot be empty',
      });
    }

    if (trimmedAuthor.length > 50) {
      return res.status(400).json({
        error: 'Author must not exceed 50 characters',
      });
    }

    if (trimmedText.length > 500) {
      return res.status(400).json({
        error: 'Text must not exceed 500 characters',
      });
    }

    const message = {
      id: randomUUID(),
      author: trimmedAuthor,
      text: trimmedText,
      timestamp: new Date().toISOString(),
    };

    addMessage(forum, message);

    return res.status(201).json(message);
  } catch {
    return res.status(500).json({
      error: 'Failed to create message',
    });
  }
});

// Handle malformed JSON body
// Express nhận biết error handler qua đúng 4 tham số nên `next` phải giữ lại.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON body',
    });
  }

  return res.status(500).json({
    error: 'Internal server error',
  });
});

export default app;
