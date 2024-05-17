import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";

// upload course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "course",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// edit course

export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      const courseId = req.params.id;
      const courseData = await CourseModel.findById(courseId) as any;

      if (thumbnail && !thumbnail.startsWith("https")) {
        if (courseData && courseData.thumbnail) {
          await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
        }

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "course",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (thumbnail && thumbnail.startsWith("https")) {
        data.thumbnail = {
          public_id: courseData?.thumbnail.public_id,
          url: courseData?.thumbnail.url,
        };
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// get single course -- without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        return res.status(200).json({
          success: true,
          course: JSON.parse(isCacheExist),
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseDate.question -courserData.links"
        );

        await redis.set(courseId, JSON.stringify(course) , "EX" , 604800 );

        if (!course) {
          return next(new ErrorHandler(404, "Course not found"));
        }

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// get all courses -- without purchasing
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses");
      if (isCacheExist) {
        res.status(200).json({
          success: true,
          courses: JSON.parse(isCacheExist),
        });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseDate.question -courserData.links"
        );

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// get course content -- only for valid users
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler(404, "You have not purchased this course yet")
        );
      }

      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// add question in course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler(400, "Invalid content id"));
      }

      if (!course) {
        return next(new ErrorHandler(404, "Course not found"));
      }

      const content = course.courseData.find(
        (content: any) => content._id.toString() === contentId
      );

      if (!content) {
        return next(new ErrorHandler(404, "Content not found"));
      }

      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add this question in content
      content.questions.push(newQuestion);

      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question for the course title: ${content.title}`,
      });

      // save the course
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// add answer in course question
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await CourseModel.findById(courseId);

      if (
        !mongoose.Types.ObjectId.isValid(contentId) ||
        !mongoose.Types.ObjectId.isValid(questionId)
      ) {
        return next(new ErrorHandler(400, "Invalid content id or question id"));
      }

      if (!course) {
        return next(new ErrorHandler(404, "Course not found"));
      }

      const content = course.courseData.find(
        (content: any) => content._id.toString() === contentId
      );

      if (!content) {
        return next(new ErrorHandler(404, "Content not found"));
      }

      const question = content?.questions?.find(
        (question: any) => question._id.toString() === questionId
      );

      if (!question) {
        return next(new ErrorHandler(404, "Question not found"));
      }

      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      // add this answer in question
      question.questionReplies?.push(newAnswer);

      // save the course
      await course?.save();

      if (!question.user._id.equals(req.user?._id)) {
        // create a notification for the admin
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Reply Received",
          message: `You have a new question reply for the course title: ${content.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: content.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mail/question-reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(500, error.message));
        }
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// add review in course
interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      // check if the courseId already exists in the userCourseList based on the courseId
      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId
      );

      if (!courseExists) {
        return next(
          new ErrorHandler(404, "You have not purchased this course yet")
        );
      }

      const course = await CourseModel.findById(courseId);

      const { review, rating }: IAddReviewData = req.body;

      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };

      course?.reviews.push(reviewData);

      let avg = 0;
      course?.reviews.forEach((review: any) => {
        avg += review.rating;
      });

      if (course) {
        course.ratings = avg / course?.reviews.length;
      }

      await course?.save();

      const notification = {
        title: "New Review Received",
        message: `${req.user?.name} has given a review in ${course?.name}`,
      };

      // create notification for the admin

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// add reply in review
interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId }: IAddReviewData = req.body;
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler(404, "Course not found"));
      }

      const review = course?.reviews.find(
        (review: any) => review._id.toString() === reviewId
      );
      if (!review) {
        return next(new ErrorHandler(404, "Review not found"));
      }

      const replyData: any = {
        user: req.user,
        comment,
      };
      
      if(!review.commentReplies) review.commentReplies = [];

      review.commentReplies?.push(replyData);
      await course?.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  }
);

// get all courses -- only for admin
export const getAllCoursesForAdmin = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try{
    getAllCoursesService(res);
  } catch (error: any){
    return next(new ErrorHandler(500, error.message));
  }
});

// Delete course -- only for admin
export const deleteCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    
    const course = await CourseModel.findById(id);
    if(!course){
      return next(new ErrorHandler(400, "Course not found"));
    }

    await course.deleteOne({id});
    await redis.del(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error: any){
    return next(new ErrorHandler(400, error.message));
  }
});

// getDriveID 
function getDriveFileId(url:string) {
  // Extract the file ID using a regular expression
  var match = url.match(/\/file\/d\/([^/]+)\//);
  
  // If a match is found and the file ID is captured
  if (match && match[1]) {
    // Return the captured file ID
    return match[1];
  } else {
    // Return null if no match is found
    return null;
  }
}

// generate video url
export const generateVideoUrl = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {videoId} = req.body;
    const fileId = getDriveFileId(videoId);
    
    const videoUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${process.env.GOOGLE_DRIVE_API_KEY}&v=.mp4`;

    console.log("v:" + videoUrl);
    
    res.status(200).json({
      success: true,
      videoUrl,
    });
  } catch (error: any){
    return next(new ErrorHandler(500, error.message));
  }
});