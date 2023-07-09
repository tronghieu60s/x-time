import { syncCartProducts } from "@/features/ecoms/shopee/common/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      syncCartProducts();
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }
}