import { NextFunction, Request, Response } from 'express';
import ErrorHandeler from '../utils/ErrorHandler';

export const ErrorMiddleware = (err:any, req:Request, res:Response, next:NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // wrong mangodb id error
  if(err.name === 'CastError'){
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandeler(404, message);
  }

  // Duplicate key error
  if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandeler(400, message);
  }

  // wrong jwt error
  if(err.name === 'JsonWebTokenError'){
    const message = 'Json Web Token is invalid. Try again!!!';
    err = new ErrorHandeler(401, message);
  }

  // wrong jwt expired error
  if(err.name === 'TokenExpiredError'){
    const message = 'Json Web Token is expired. Try again!!!';
    err = new ErrorHandeler(401, message);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};