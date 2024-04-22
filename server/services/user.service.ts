import { Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";
import userModel from "../models/user.model";


// get user by id
export const getUserById = async (id: string, res: Response ) => {
  try {
    const userJson = await redis.get(id);
    const user = JSON.parse(userJson || '');
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error: any) {
    throw new ErrorHandler(400, error.message);
  }
}

// get all users
export const getAllUsersService = async (res: Response) => {
  try {
    const users = await userModel.find().sort({createdAt: -1});
    res.status(200).json({
      success: true,
      users,
    })
  } catch (error: any) {
    throw new ErrorHandler(400, error.message);
  }
}

// update user role
export const updateUserRoleService = async (id: string, role: string, res: Response) => {
  try {
    const user = await userModel.findByIdAndUpdate(id, {role}, {new: true});
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error: any) {
    throw new ErrorHandler(400, error.message);
  }
}