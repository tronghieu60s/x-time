import { getProductsPromotion } from '@/features/ecommerces/shopee/common/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const id = Number(req.query.id || 0);
      const products = await getProductsPromotion(id);

      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, data: [] });
    }
  }
}
