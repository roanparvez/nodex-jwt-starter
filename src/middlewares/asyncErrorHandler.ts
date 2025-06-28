import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncErrorHandler =
  (myFunc: AsyncHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(myFunc(req, res, next)).catch(next);
  };
