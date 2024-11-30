import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

export async function GetSingleClient(req: Request, res: Response) {

  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  Response.Content = await Prisma.interviewClient.findUnique({
    where: {
      id: req.params.id,
    }
  });

  if (Response.Content)
     Response.Message.Content = "";
  res.send(Response);
}
