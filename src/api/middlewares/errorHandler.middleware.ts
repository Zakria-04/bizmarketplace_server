import { Request, Response, NextFunction } from "express";

const errorHandling = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    error: err.message,
  });
};
export default errorHandling;
