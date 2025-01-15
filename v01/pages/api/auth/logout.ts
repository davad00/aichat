import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Clear the token cookie
  res.setHeader(
    'Set-Cookie',
    'token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
  );

  return res.status(200).json({ message: 'Logged out successfully' });
} 