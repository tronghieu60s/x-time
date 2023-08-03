import { getProductsMarketDetail } from '@/features/ecoms/cooky/common/api';
import type { NextApiRequest, NextApiResponse } from 'next';

let cacheFoods = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const id = Number(req.query.id || 0);

      let food: any = null;
      if (cacheFoods[id]) {
        food = cacheFoods[id];
      } else {
        food = await getProductsMarketDetail(id);
        cacheFoods[id] = food;
      }

      res.status(200).json({ success: true, data: food });
    } catch (error) {
      res.status(500).json({ success: false, data: null });
    }
  }
}
