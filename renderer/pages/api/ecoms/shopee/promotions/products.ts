import { filterByConditions } from '@/core/commonFuncs';
import { getProductsPromotion } from '@/features/ecoms/shopee/common/api';
import type { NextApiRequest, NextApiResponse } from 'next';

const tempProducts = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const promotionid = Number(req.query.promotionid || 20);

      let products: any[] = [];
      if (tempProducts[promotionid]) {
        products = tempProducts[promotionid];
      } else {
        products = await getProductsPromotion(promotionid);
      }

      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, data: [] });
    }
  }
}
