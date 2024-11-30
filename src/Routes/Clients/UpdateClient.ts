import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import CreateClientScheme from "../../Schemas/Client/CreateClientScheme";
import ResponseSchema from "../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

export async function UpdateClient(req: Request, res: Response) {
  let userv = await CreateClientScheme().validate(req.body);

  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  Response.Content = await Prisma.interviewClient.update({
    where: {
      id: req.params.id,
    },
    data: {
      document: userv.document,
      name: userv.name,
    },
  });

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
