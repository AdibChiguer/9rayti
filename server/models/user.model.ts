import mongoose, {Document , Model , Schema} from "mongoose";
import bcrypt from "bcryptjs";
require("dotenv").config();
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  },
  role: string;
  isVerified: boolean;
  courses: Array<{courseId: string}>
  comparePassword: (password: string) => Promise<boolean>;
  signAccessToken: () => string;
  signRefreshToken: () => string;
};

const userSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    match: [emailRegexPattern, "Please enter a valid email address"]
  },
  password: {
    type: String,
    minlength: [6, "Your password must be at least 6 characters"],
    select: false
  },
  avatar: {
    public_id: String,
    url: String
  },
  role: {
    type: String,
    default: "user"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  courses: [
    {
      courseId: String,
    }
  ],
}, {timestamps: true});

// Encrypting password before saving user
userSchema.pre<IUser>("save", async function(next) {
  if(!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign access token
userSchema.methods.signAccessToken = function() {
  return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN as string || '' , {expiresIn: "15m"});
};

// sign refresh token
userSchema.methods.signRefreshToken = function() {
  return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN as string || '' , {expiresIn: "3d"});
};


// Compare user password
userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model<IUser>('User', userSchema);
export default userModel as Model<IUser>;