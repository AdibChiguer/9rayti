import { NextFunction , Response , Request  } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order.model";
import ErrorHandler from "../utils/ErrorHandler";

// create new order
export const newOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const order = await OrderModel.create(req.body);

  res.status(201).json({
    success: true,
    order,
  });
});

// get all orders -- only for admin
export const getAllOrdersService = async (res: Response) => {
  try {
    const orders = await OrderModel.find().sort({createdAt: -1});
    res.status(200).json({
      success: true,
      orders,
    })
  } catch (error: any) {
    throw new ErrorHandler(400, error.message);
  }
}