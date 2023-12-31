import { getProductsMarket } from '@/features/ecommerces/cooky/common/api';
import {
  getCacheProductsMarket,
  setCacheProductsMarket,
} from '@/features/ecommerces/cooky/common/database';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const id = Number(req.query.id || 0);

      let products = await getCacheProductsMarket(id);
      if (products) {
        res.status(200).json({ success: true, data: products });
        return;
      }

      try {
        products = await getProductsMarket(id);
        setCacheProductsMarket(id, products);

        res.status(200).json({ success: true, data: products });
      } catch (error) {
        res.status(200).json({ success: true, data: products });
      }
    } catch (error) {
      res.status(500).json({ success: false, data: null });
    }
  }
}
