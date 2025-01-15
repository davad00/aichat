import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { OpenRouterService } from '@/lib/services/openrouter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string };

    await connectDB();

    // Get user data
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.openRouterApiKey) {
      return res.status(400).json({ message: 'OpenRouter API key not configured' });
    }

    const { messages, model = user.widgetSettings.selectedModel } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid messages format' });
    }

    const openRouterService = new OpenRouterService(user.openRouterApiKey);

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response
    await openRouterService.createStreamingChatCompletion(
      messages,
      model,
      (chunk) => {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
    );

    res.end('data: [DONE]\n\n');
  } catch (error) {
    console.error('Chat completion error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 