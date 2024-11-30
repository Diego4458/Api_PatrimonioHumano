import { PrismaClient } from "@prisma/client";
import { object, string } from "yup";
import { Request, Response } from "express";
import { error } from "console";
import ResponseSchema from "../../Schemas/ResponseSchema";
import JwtSignResult from "../../Utils/JwtSignResult";

const Prisma = new PrismaClient();

const CreateUserScheme = object({
  name: string().required(),
  surname: string().required(),
});

export async function UpdateData(req: Request, res: Response) {
  let userv = await CreateUserScheme.validate(req.body);
  var Response: ResponseSchema = {
    Message: {
      Content: "Falha ao atualizar os dados",
      Title: null,
    },
    Content: null,
  };
  try {
    var ID = res.locals.userInfo.id;

    var User = await Prisma.user.update({
      where: {
        id: ID,
      },
      data: {
        name: userv.name,
        surname: userv.surname,
      },
    });

    if (!User) throw error("User not finded!");


    Response.Content = await JwtSignResult(User);
    Response.Message.Content = "";
    res.send(Response);
  } catch (e: any) {
    console.warn("[Server] UpdateUser ", e);
    res.status(500).send(Response);
  }
}
