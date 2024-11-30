import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import CreateClientScheme from "../../Schemas/Client/CreateClientScheme";
import ResponseSchema from "../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

export async function CreateClient(req: Request, res: Response) {
  let userv = await CreateClientScheme().validate(req.body);

  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  try {
    if (
      await Prisma.interviewClient.count({
        where: {
          document: userv.document,
        },
      })
    ) {
        Response.Message.Content = "Ja existe um usuario com esse documento cadastrado no sistema!"
      return;
    }

    Response.Content = await Prisma.interviewClient.create({
      data: {
        document: userv.document,
        name: userv.name,
      },
    });
  } finally {
    if (Response.Content) Response.Message.Content = "";
    res.send(Response);
  }
}
