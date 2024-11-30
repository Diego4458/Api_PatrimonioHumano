import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";
import { array, object, string } from "yup";
import CreateContactScheme from "../../Schemas/Contact/CreateContactScheme";

const CreateUserScheme = object({
  name: string().required().min(2).max(256).label("Nome"),
  contact: array(CreateContactScheme()),
});

const Prisma = new PrismaClient();

export async function CreateCompany(req: Request, res: Response) {
  let userv = await CreateUserScheme.validate(req.body);

  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  if (
    await Prisma.company.findUnique({
      where: {
        name: userv.name,
      },
    })
  ) {
    Response.Message.Content =
      "Ja existe uma empresa com esse nome no banco de dados!";
    res.send(Response);
    return;
  }

  const Company = await Prisma.company.create({
    data: {
      name: userv.name,
    },
  });

  var ContactArray = [];
  if (userv.contact) {
    for (let index = 0; index < userv.contact.length; index++) {
      ContactArray.push(
        await Prisma.contact.create({
          data: {
            CompanyId: Company.id,
            Address: userv.contact[index]!.Address ?? "",
            responsibleName: userv.contact[index].responsibleName,
            email: userv.contact[index].email,
            phoneNumber: userv.contact[index].phoneNumber,
          },
        })
      );
    }
  }

  Response.Content = {
    ...Company,
    Contact: ContactArray,
  };

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
