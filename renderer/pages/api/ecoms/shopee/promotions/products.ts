import { filterByConditions } from '@/core/commonFuncs';
import { getProductsPromotion } from '@/features/ecoms/shopee/common/api';
import type { NextApiRequest, NextApiResponse } from 'next';

const tempProducts = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);
      const promotionid = Number(req.query.promotionid || 20);
      const filter = JSON.parse(String(req.query.filter) || '{}');

      let products: any[] = [];
      if (tempProducts[promotionid]) {
        products = tempProducts[promotionid];
      } else {
        products = await getProductsPromotion(promotionid);
      }

      const filteredProducts = filterByConditions(products, filter);
      const paginationProducts = filteredProducts.slice((page - 1) * limit, page * limit);

      res.status(200).json({
        success: true,
        data: {
          products: paginationProducts,
          pagination: { page, limit, total: filteredProducts.length },
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, data: null });
    }
  }
}
