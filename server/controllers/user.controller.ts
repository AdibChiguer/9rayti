import { Request, Response, NextFunction } from "express";
import userModel, {IUser} from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
require("dotenv").config();
import ejs from "ejs";
import sendMail from "../utils/sendMail";

// Register a new user => /api/v1/register
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string; 
}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {name, email, password, avatar}: IRegistrationBody = req.body;
    const isEmailExist = await userModel.findOne({email});
    if (isEmailExist) {
      return next(new ErrorHandler(400, "Email already exists"));
    }
    
    const user:IRegistrationBody = {
      name,
      email,
      password,
      avatar
    };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const token = activationToken.token;

    const data = {user: {name:user.name}, activationCode};
    const html = await ejs.renderFile(`${__dirname}/../mails/activationEmail.ejs`, data);

    try {
      await sendMail({
        email: user.email,
        subject: "Account Activation",
        template: "activationEmail.ejs",
        data,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account`,
        token
      });
    } catch (error: any) {
      return next(new ErrorHandler(500, error.message));
    }
  } catch (error: any) {
    next(new ErrorHandler(400,error.message));
  }
});

interface IActivationToken {
  token: string;
  activationCode: string;
}

// Create activation token
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign({user, activationCode}, process.env.JWT_SECRET as Secret , {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
  return {token, activationCode};
}