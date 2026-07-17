import type { Request, Response, NextFunction } from "express";
import Joi from "joi";

import handleResponse from "../../utils/handleResponse";

const userSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).unknown(true);

const validateUserInputs = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return handleResponse(
      res,
      400,
      error.details[0]?.message ?? "Invalid user input",
      {
        errorCode: error.details[0]?.message ?? "INVALID_USER_INPUT",
      },
    );
  }

  next();
};

export default validateUserInputs;
