import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

export async function FindSingleApointment(req: Request, res: Response) {

  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  Response.Content = await Prisma.apointment.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      company: {},
      presences: {
        include: {
          Client: {},
        },
      },
    },
  });

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
