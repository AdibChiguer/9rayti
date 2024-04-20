import { Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";


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