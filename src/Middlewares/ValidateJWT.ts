import { NextFunction, Request, Response } from "express";

export default function ValidateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwt = req.headers["authorization"];
  const jwtService = require("jsonwebtoken");
  
  jwtService.verify(jwt, process.env.JWT_TOKEN, (err: any, userInfo: any) => {
    if (err) {
      res.status(403).end();
      return;
    }
    res.locals.userInfo =userInfo;
    next();
  });
}
