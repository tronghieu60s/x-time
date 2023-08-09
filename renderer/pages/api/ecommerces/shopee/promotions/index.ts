import { getPromotions } from '@/features/ecommerces/shopee/common/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const promotions = await getPromotions();

      res.status(200).json({ success: true, data: promotions });
    } catch (error) {
      res.status(500).json({ success: false, data: null });
    }
  }
}
