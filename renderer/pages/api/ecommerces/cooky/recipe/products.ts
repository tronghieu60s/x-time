import { getProductsRecipe } from '@/features/ecommerces/cooky/common/api';
import {
  getCacheProductsRecipe,
  setCacheProductsRecipe,
} from '@/features/ecommerces/cooky/common/database';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const id = Number(req.query.id || 0);

      let products = await getCacheProductsRecipe(id);
      if (products) {
        res.status(200).json({ success: true, data: products });
        return;
      }

      try {
        products = await getProductsRecipe(id);
        setCacheProductsRecipe(id, products);

        res.status(200).json({ success: true, data: products });
      } catch (error) {
        res.status(200).json({ success: true, data: products });
      }
    } catch (error) {
      res.status(500).json({ success: false, data: null });
    }
  }
}
