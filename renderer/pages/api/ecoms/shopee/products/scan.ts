import { scanProductsDetails } from '@/features/ecoms/shopee/common/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      await scanProductsDetails();
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }
}
