import { testLogin } from '@/features/ecoms/shopee/common/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const logged = await testLogin();
      res.status(200).json({ success: true, logged });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }
}
