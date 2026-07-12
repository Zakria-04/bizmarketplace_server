import type { Response } from "express";

type ResponseOptions<T> = {
  data?: T | null;
  errorCode?: string;
};

const handleResponse = <T = unknown>(
  res: Response,
  status: number,
  message: string,
  options: ResponseOptions<T> = {},
) => {
  const { data, errorCode } = options;

  return res.status(status).json({
    status,
    success: status >= 200 && status < 300,
    message,
    ...(errorCode && { errorCode }),
    ...(data !== undefined && { data }),
  });
};

export default handleResponse;
