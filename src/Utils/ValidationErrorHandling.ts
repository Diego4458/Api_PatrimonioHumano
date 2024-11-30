import { ValidationError } from "yup";
import { NextFunction, Request, Response } from "express";
import { log } from "console";

export const ValidationErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err && err.name == "ValidationError") {
    (err as ValidationError).errors.forEach((element) => {
      res.status(500).send({
        Message: {
          Content: element,
        },
      });
      return;
    });
  } else {
    log(err);
    res.status(500).send({
      Message: {
        Content: "Ocorreu um Erro Interno",
      },
    });
  }
};
