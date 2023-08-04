import { getProfile } from '@/features/ecoms/cooky/common/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const username = String(req.query.username || '');
      const profile = await getProfile(username);

      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      res.status(500).json({ success: false, data: null });
    }
  }
}
