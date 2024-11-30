import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import CreateContactScheme from "../../../Schemas/Contact/CreateContactScheme";
import ResponseSchema from "../../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

export async function UpdateContact(req: Request, res: Response) {
  let userv = await CreateContactScheme().validate(req.body);

  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  var ContactInfo = await Prisma.contact.findUnique({
    where: {
      id: req.params.contactId,
    },
  });

  if (!ContactInfo || ContactInfo.CompanyId != req.params.id) {
    res.send(Response);
    return;
  }

  Response.Content = await Prisma.contact.update({
    where: {
      id: req.params.contactId,
    },
    data:{
      Address: userv.Address ?? undefined,
      email: userv.email,
      phoneNumber: userv.phoneNumber,
      responsibleName: userv.responsibleName
    }
  });

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
