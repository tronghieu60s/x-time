import { getProducts } from '@/features/products/common/database';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      const products = await getProducts();
      const paginationProducts = products.slice((page - 1) * limit, page * limit);

      res.status(200).json({
        success: true,
        data: {
          products: paginationProducts,
          pagination: { page, limit, total: products.length },
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, data: null });
    }
  }
}

