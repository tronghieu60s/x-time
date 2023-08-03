import { getProductsPromotion } from '@/features/ecoms/shopee/common/api';
import type { NextApiRequest, NextApiResponse } from 'next';

let cacheProducts = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const id = Number(req.query.id || 0);

      let products: any[] = [];
      if (cacheProducts[id]) {
        products = cacheProducts[id];
      } else {
        products = await getProductsPromotion(id);
        cacheProducts[id] = products;
      }

      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, data: [] });
    }
  }
}
