import { NextFunction , Request , Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel from "../models/order.model";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";
import path from "path";
import ejs, { name } from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";


// Create Order
export const createOrder = CatchAsyncError(async (req: Request , res: Response , next: NextFunction) => {
  try {
    const {courseId , paymentInfo} = req.body;
    const user = await userModel.findById(req.user?.id);
    const courseExists = user?.courses.some((course) => course.toString() === courseId);
    if(courseExists) {
      return next(new ErrorHandler(400 , "You have already purchased this course"));
    }

    const course = await courseModel.findById(courseId);
    if(!course) {
      return next(new ErrorHandler(404 , "Course not found"));
    }

    const data:any = {
      courseId: course?._id,
      userId: user?._id,
    }

    const mailData = {
      order: {
        _id: course?._id.toString().slice(0 , 6),
        name: course?.name,
        price: course?.price,
        date : new Date().toLocaleString("en-US" , {year: "numeric" , month: "long" , day: "numeric"}),
      },
    }

    const html = await ejs.renderFile(path.join(__dirname , "../mails/order-confirmation.ejs") , {order: mailData});

    try {
      if(user){
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });
      }
    } catch (error:any) {
      return next(new ErrorHandler(500 , error.message));
    }
    user?.courses.push(course?._id);

    await redis.set(req.user?._id , JSON.stringify(user));

    await user?.save();

    await NotificationModel.create({
      user: user?._id,
      title: "New Order",
      message: `You have a new order for the course ${course?.name}`,
    });

    course.purchased ? course.purchased += 1 : course.purchased;

    await course.save();

    newOrder(data , res , next);

  } catch (error:any) {
    return next(new ErrorHandler(500 , error.message));
  }
});


// get all orders -- only for admin
export const getAllOrders = CatchAsyncError(async (req: Request , res: Response , next: NextFunction) => {
  try {
    getAllOrdersService(res);
  } catch (error:any) {
    return next(new ErrorHandler(500 , error.message));
  }
});

// 