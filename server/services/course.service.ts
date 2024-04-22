import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

// create course
export const createCourse = CatchAsyncError(async(data: any, res: Response) => {
  try {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// get all courses
export const getAllCoursesService = async (res: Response) => {
  try {
    const courses = await CourseModel.find().sort({createdAt: -1});
    res.status(200).json({
      success: true,
      courses,
    })
  } catch (error: any) {
    throw new ErrorHandler(400, error.message);
  }
}