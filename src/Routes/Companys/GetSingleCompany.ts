import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

export async function GetSingleCompany(req: Request, res: Response) {
  var Response: ResponseSchema = {
    Message: {
      Content: "Empresa não encontrada!",
      Title: null,
    },
    Content: null,
  };

  Response.Content = await Prisma.company.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      Contacts: true,
    },
  });

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
