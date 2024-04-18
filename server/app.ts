import express, { Request , Response , NextFunction } from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
require('dotenv').config();
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.routes';


// body parser
app.use(express.json({limit: '50mb'}));

// cookie parser
app.use(cookieParser());

// cors => corss origin resource sharing
app.use(cors({
  origin: process.env.ORIGIN,
}));

// routes
app.use('/api/v1', userRouter);

// testing api
app.get('/test', (req:Request, res:Response, next:NextFunction) => {
  res.status(200).json({message: 'Hello World!'});
});


// unknown route
app.all("*",(req:Request, res:Response, next:NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.status = 404;
  next(err);
});

app.use(ErrorMiddleware);