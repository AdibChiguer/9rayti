import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
require("dotenv").config();
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import { accessTokenOptions , refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service";
import cloudinary from "cloudinary";

// Register a new user => /api/v1/register
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, avatar }: IRegistrationBody = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler(400, "Email already exists"));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
        avatar,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const token = activationToken.token;

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        `${__dirname}/../mails/activationEmail.ejs`,
        data
      );

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
          token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(500, error.message));
      }
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

// Create activation token
interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    }
  );
  return { token, activationCode };
};

// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code }: IActivationRequest =
        req.body;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.JWT_SECRET as Secret
      ) as {
        user: IUser;
        activationCode: string;
      };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler(400, "Invalid activation code"));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler(400, "Email already exists"));
      }

      const user = await userModel.create({ name, email, password });
      res.status(201).json({
        success: true,
        message: "Account is activated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

// login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: ILoginRequest = req.body;
      if (!email || !password) {
        return next(new ErrorHandler(400, "Please enter email and password"));
      }

      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler(401, "Invalid email or password"));
      }

      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
        return next(new ErrorHandler(401, "Invalid email or password"));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

// logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id || '';

      redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

// update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return next(new ErrorHandler(400, "Please login to access this resource"));
      }

      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN as Secret) as JwtPayload;
      if (!decoded) {
        return next(new ErrorHandler(400, "Please login to access this resource"));
      }

      const session = await redis.get(decoded.id);
      if (!session) {
        return next(new ErrorHandler(400, "Please login to access this resource"));
      }

      const user = JSON.parse(session);
      const access_token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as Secret, {
        expiresIn: "15m",
      });

      const refresh_token = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as Secret, { 
        expiresIn: "3d" 
      });

      req.user =  user;

      res.cookie("access_token", access_token, accessTokenOptions);
      res.cookie("refresh_token", refresh_token, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(user) , "EX" , 604800 );

      res.status(200).json({ success: true, access_token });
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

// get user info
export const getUserInfo = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try{
    const userId = req.user?._id;
    getUserById(userId, res);
  } catch (error: any){
    return next(new ErrorHandler(400, error.message));
  }
});


// social auth
interface ISocialAuthBody {
  email: string,
  name: string,
  avatar: string,
}

export const socialAuth = CatchAsyncError(async(req: Request, res: Response, next: NextFunction ) => {
  try{
    const {email, name , avatar} =  req.body as ISocialAuthBody;
    const user = await userModel.findOne({email});
    if(!user){
      const newUser = await userModel.create({email, name, avatar});
      sendToken(newUser, 200, res);
    } else{
      sendToken(user, 200, res);
    }
  } catch (error: any){
    return next(new ErrorHandler(400, error.message));
  }
});


// update user info
interface IUpdateUserBody {
  name?: string,
  email?: string,
}

export const updateUserInfo = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try{
    const userId = req.user?._id;
    const {name} = req.body as IUpdateUserBody;
    const user = await userModel.findById(userId);
    
    // if(email && user){
    //   const isEmailExist = await userModel.findOne({email});
    //   if(isEmailExist){
    //     return next(new ErrorHandler(400, "Email already exists"));
    //   }
    //   user.email = email;
    // }

    if(name && user){
      user.name = name;
    }

    await user?.save();
    await redis.set(userId, JSON.stringify(user));

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error: any){
    return next(new ErrorHandler(400, error.message));
  }
});


// update user password
interface IUpdatePassword{
  oldPassword: string,
  newPassword: string,
}

export const updateUserPassword = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {oldPassword, newPassword} = req.body as IUpdatePassword;
    
    if(!oldPassword || !newPassword){
      return next(new ErrorHandler(400, "Please enter old and new password"));
    }

    const user = await userModel.findById(req.user?._id).select("+password");
    
    if(user?.password === undefined){
      return next(new ErrorHandler(400, "Invalid user"));
    }

    const isPasswordMatched = await user?.comparePassword(oldPassword);
    if(!isPasswordMatched){
      return next(new ErrorHandler(400, "password is incorrect"));
    }

    user.password = newPassword;

    await user.save();
    await redis.set(req.user?._id, JSON.stringify(user));

    res.status(201).json({
      success: true,
      message: "Password updated successfully",
      user,
    });

  } catch (error: any){
    return next(new ErrorHandler(400, error.message));
  }
});

// update profile picture
interface IUpdateProfilePicture{
  avatar: string,
}

export const updateProfilePicture = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {avatar} = req.body as IUpdateProfilePicture;

    const userId = req.user?._id;

    const user = await userModel.findById(userId);

    if(avatar && user) {
      // if user has an avatar, delete it
      if(user?.avatar.public_id){
        // delete previous image
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(avatar , {
          folder: "avatars",
          width: 150,
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };

      } else {
        const myCloud = await cloudinary.v2.uploader.upload(avatar , {
          folder: "avatars",
          width: 150,
        });
  
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }
  
  await user?.save();
  await redis.set(userId, JSON.stringify(user));
  res.status(201).json({
    success: true,
    user,
  });

  } catch (error: any){
    return next(new ErrorHandler(400, error.message));
  }
});

// get all users --- onlu for admin
export const getAllUsers = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try{
    getAllUsersService(res);
  } catch (error: any){
    return next(new ErrorHandler(500, error.message));
  }
});

// update user role --- only for admin
export const updateUserRole = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {id , role} = req.body;
    updateUserRoleService(id, role, res);
  } catch (error: any){
    return next(new ErrorHandler(400, error.message));
  }
});

// Delete user -- only for admin
export const deleteUser = CatchAsyncError(async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    
    const user = await userModel.findById(id);
    if(!user){
      return next(new ErrorHandler(400, "User not found"));
    }

    await user.deleteOne({id});
    await redis.del(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error: any){
    return next(new ErrorHandler(400, error.message));
  }
});