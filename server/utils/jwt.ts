require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  // upload session to redis
  redis.set(user._id, JSON.stringify(user) as any);

  // parse env variables to integrates with fallbacks values
  const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
  const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);

  // options for cookies
  const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpires * 1000),
    maxAge: accessTokenExpires * 1000,
    httpOnly: true,
    sameSite: 'lax',
    // secure: process.env.NODE_ENV === 'production'
  };

  const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpires * 1000),
    maxAge: refreshTokenExpires * 1000,
    httpOnly: true,
    sameSite: 'lax',
    // secure: process.env.NODE_ENV === 'production'
  };
  // only set secure to true if in production

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    accessToken,
    user
  });
}