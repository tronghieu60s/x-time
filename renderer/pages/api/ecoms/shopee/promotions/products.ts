import { getProductsPromotion } from '@/features/ecoms/shopee/common/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);
      const promotionid = Number(req.query.promotionid || 20);

      const { total, products } = await getProductsPromotion(page, limit, promotionid);
      const response = {
        success: true,
        data: { products, pagination: { page, limit, total } },
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ success: false, data: null });
    }
  }
}
