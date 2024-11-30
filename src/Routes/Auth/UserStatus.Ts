import { Request, Response } from "express";

export function UserStatus(req: Request, res: Response){
    res.send(res.locals.userInfo)
}