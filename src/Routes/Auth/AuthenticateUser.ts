import { PrismaClient } from "@prisma/client";
import { object, setLocale, string } from "yup";
import HashPassword from "../../Utils/EncryptPassword";
import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";

import JwtSignResult from "../../Utils/JwtSignResult";

const Prisma = new PrismaClient();
const LoginScheme = object({
  email: string().required().email().lowercase(),
  password: string().required().label('senha'),
});

export async function AuthenticateUser(req: Request, res: Response) {
  let userv = await LoginScheme.validate(req.body);
  var Response: ResponseSchema = {
    Message: {
      Content: "Usuario não existe ou não foi encontrado",
      Title: null,
    },
    Content: null,
  };
  try {
    var user = await Prisma.user.findUnique({
      where: {
        email: userv.email,
        passwordHash: HashPassword(userv.password),
      },
    });

    if (user) {
      if (user.role == "unidentified") {
        Response.Message.Content =
          "A Conta não tem autorização para acessar o sistema!";
        res.status(403).send(Response);
        return;
      }
      Response.Content = await JwtSignResult(user);
      Response.Message.Content = "";
      res.send(Response);
      return;
    }
  } catch (e: any) {
    console.warn("[Server] CreateUser ", e);
    Response.Message.Content = "Ocorreu um Erro ao Processar a Requisição";
    res.status(500).send(Response);
  }
  res.status(404).send(Response);
}
