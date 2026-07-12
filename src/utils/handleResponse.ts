import { Request, Response } from "express";

const handleResponse = <T>(
  res: Response,
  status: number,
  message: string,
  data?: T | null,
) => {
  res.status(status).json({
    status,
    success: status < 400,
    message,
    data,
  });
};

export default handleResponse;
