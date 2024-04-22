import { Request , Response , NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// create Layout
export const createLayout = CatchAsyncError(async (req: Request , res: Response , next: NextFunction) => {
  try {
    const { type } = req.body;
    if(!type) {
      return next(new ErrorHandler(400 , "Please enter layout type"));
    }

    const isTypeExist = await LayoutModel.findOne({type});
    if(isTypeExist){
      return next(new ErrorHandler(400 , `${type} already exists`));
    }


    if(type === "Banner"){
      const { title , subTitle , image } = req.body;
      const myCloud = await cloudinary.v2.uploader.upload(image , {
        folder: "layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        },
        title,
        subTitle
      }
      await LayoutModel.create(banner);
    } else if(type === "FAQ"){

      const { faq } = req.body;
      const faqItems = await Promise.all(faq.map(async (item: any) => {
        return {
          question: item.question,
          answer: item.answer
        }
      }));
      await LayoutModel.create({type: "FAQ" , faq: faqItems});

    } else if(type === "Categories"){

      const { categories } = req.body;
      const categoriesItems = await Promise.all(categories.map(async (item: any) => {
        return {
          title: item.title,
        }
      }));
      await LayoutModel.create({type: "Categories" , categories: categoriesItems});

    }

    res.status(201).json({
      success: true,
      message: "Layout created successfully"
    });

  } catch (error: any) {
    next(new ErrorHandler(500 , error.message));
  }
});

// edit Layout
export const editLayout = CatchAsyncError(async (req: Request , res: Response , next: NextFunction) => {
  try {
    const { type } = req.body;
    if(!type){
      return next(new ErrorHandler(404 , "Layout not found"));
    }

    if(type === "Banner"){

      const bannerData:any = await LayoutModel.findById({ type: "Banner" });
      const { title , subTitle , image } = req.body;
      if(bannerData){
        await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
      }
      const myCloud = await cloudinary.v2.uploader.upload(image , {
        folder: "layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        },
        title,
        subTitle
      }

      await LayoutModel.findByIdAndUpdate(bannerData?._id , {banner});

    } else if(type === "FAQ"){

      const { faq } = req.body;
      const faqData:any = await LayoutModel.findById({ type: "FAQ" });
      const faqItems = await Promise.all(faq.map(async (item: any) => {
        return {
          question: item.question,
          answer: item.answer
        }
      }));
      await LayoutModel.findByIdAndUpdate(faqData?._id , {type: "FAQ" , faq: faqItems});

    } else if(type === "Categories"){

      const { categories } = req.body;
      const categoriesData:any = await LayoutModel.findById({ type: "Categories" });
      const categoriesItems = await Promise.all(categories.map(async (item: any) => {
        return {
          title: item.title,
        }
      }));
      await LayoutModel.findByIdAndUpdate(categoriesData?._id , { type: "Categories" ,categories: categoriesItems});
    }

    res.status(200).json({
      success: true,
      message: "Layout updated successfully"
    });

  } catch (error: any) {
    next(new ErrorHandler(500 , error.message));
  }
});

// get Layout by type
export const getLayoutByType = CatchAsyncError(async (req: Request , res: Response , next: NextFunction) => {
  try {
    const { type } = req.body;
    if(!type){
      return next(new ErrorHandler(404 , "Layout not found"));
    }

    const layout = await LayoutModel.findOne({type});
    if(!layout){
      return next(new ErrorHandler(404 , "Layout not found"));
    }

    res.status(200).json({
      success: true,
      layout
    });
  } catch (error: any) {
    next(new ErrorHandler(500 , error.message));
  }
});