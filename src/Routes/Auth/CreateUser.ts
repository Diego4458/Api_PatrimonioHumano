import { PrismaClient } from "@prisma/client";
import { object, string } from "yup";

import { Request, Response } from "express";

import HashPassword from "../../Utils/EncryptPassword";
import ResponseSchema from "../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

const CreateUserScheme = object({
  email: string().required().email().lowercase(),
  name: string().required().min(2).max(32).label("Nome"),
  surname: string().required().min(2).max(32).label("Sobrenome"),
  password: string().required().min(4).max(32).label("Senha"),
});

export async function CreateUser(req: Request, res: Response) {
  let userv = await CreateUserScheme.validate(req.body);
  var Response: ResponseSchema = {
    Message: {
      Content: "ja existe usuario cadastrado com essas credenciais!",
      Title: null,
    },
    Content: false,
  };

  try {
    if (await Prisma.user.findUnique({ where: { email: userv.email } })) {
      res.status(200).send(Response);
      return;
    }

    await Prisma.user.create({
      data: {
        email: userv.email,
        name: userv.name,
        surname: userv.surname,
        passwordHash: HashPassword(userv.password),
      },
    });
    Response.Message.Content = "Cadastrado com sucesso!";
    Response.Content = true;
    res.status(201).send(Response);
    return;
  } catch (e: any) {
    console.warn("[Server] CreateUser ", e);
    Response.Message.Content =
      "Ocorreu um Erro Interno ao processar seus dados!";
    res.status(500).send(Response);
  }
}
