import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import CreateContactScheme from "../../../Schemas/Contact/CreateContactScheme";
import ResponseSchema from "../../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

export async function CreateContact(req: Request, res: Response) {
  let userv = await CreateContactScheme().validate(req.body);

  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  var ContactInfo = await Prisma.company.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!ContactInfo) {
    res.send(Response);
    return;
  }

  Response.Content = await Prisma.contact.create({
    data:{
      Address: userv.Address ?? '',
      email: userv.email,
      phoneNumber: userv.phoneNumber,
      responsibleName: userv.responsibleName,
      CompanyId: req.params.id,
    }
  });

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
