import { NextFunction , Response , Request  } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order.model";

// create new order
export const newOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const order = await OrderModel.create(req.body);

  res.status(201).json({
    success: true,
    order,
  });
});