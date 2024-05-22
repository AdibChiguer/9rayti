import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// create Layout
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, title, subTitle, image, faq, categories } = req.body;

      if (!type) {
        return next(new ErrorHandler(400, "Please enter layout type"));
      }

      const isTypeExist = await LayoutModel.findOne({ type });

      if (isTypeExist) {
        return next(new ErrorHandler(400, `${type} already exists`));
      }

      if (type === "Banner") {
        if (!title || !subTitle || !image) {
          return next(new ErrorHandler(400, "Missing required fields for Banner"));
        }

        // Convert base64 string to buffer
        const buffer = Buffer.from(image, 'base64');

        // Define the result type from Cloudinary
        interface UploadResult {
          public_id: string;
          secure_url: string;
        }

        // Upload the image to Cloudinary
        const uploadResult = await new Promise<UploadResult>((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "layout" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result as UploadResult); // Explicitly typecast result
              }
            }
          );
          uploadStream.end(buffer);
        });

        const banner = {
          type: "Banner",
          banner: {
            image: {
              public_id: uploadResult.public_id,
              url: uploadResult.secure_url,
            },
            title,
            subTitle,
          },
        };

        await LayoutModel.create(banner);

      } else if (type === "FAQ") {
        if (!faq || !Array.isArray(faq)) {
          return next(new ErrorHandler(400, "FAQ must be an array"));
        }

        const faqItems = faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        }));

        await LayoutModel.create({ type: "FAQ", faq: faqItems });

      } else if (type === "Categories") {
        if (!categories || !Array.isArray(categories)) {
          return next(new ErrorHandler(400, "Categories must be an array"));
        }

        const categoriesItems = categories.map((item: any) => ({
          title: item.title,
        }));

        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(201).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      console.error("Error creating layout:", error); // Log the error
      next(new ErrorHandler(500, error.message || "Internal Server Error"));
    }
  }
);

// edit Layout
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      if (!type) {
        return next(new ErrorHandler(404, "Layout not found"));
      }

      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findById({ type: "Banner" });

        const { title, subTitle, image } = req.body;

        if (bannerData) {
          await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
        }

        const data = image.startsWith("https") ? bannerData : await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

        const banner = {
          type: "Banner",
          image: {
            public_id: image.startsWith("https") ? bannerData.banner.image.public_id : data?.public_id,
            url: image.startsWith("https") ? bannerData.banner.image.url : data?.secure_url,
          },
          title,
          subTitle,
        };

        await LayoutModel.findByIdAndUpdate(bannerData?._id, { banner });
        
      } else if (type === "FAQ") {
        const { faq } = req.body;
        const faqData: any = await LayoutModel.findById({ type: "FAQ" });
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(faqData?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      } else if (type === "Categories") {
        const { categories } = req.body;
        const categoriesData: any = await LayoutModel.findById({
          type: "Categories",
        });
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      next(new ErrorHandler(500, error.message));
    }
  }
);

// get Layout by type
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      if (!type) {
        return next(new ErrorHandler(404, "Layout not found"));
      }
      const layout = await LayoutModel.findOne({ type });
      if (!layout) {
        return next(new ErrorHandler(404, "Layout not found"));
      }
      res.status(200).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      next(new ErrorHandler(500, error.message));
    }
  }
);
