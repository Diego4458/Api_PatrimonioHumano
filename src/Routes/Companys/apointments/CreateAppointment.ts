import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { array, date, object, string } from "yup";
import ResponseSchema from "../../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

export async function CreateAppointment(req: Request, res: Response) {
  let userv = await date()
    .required()
    .min(Date())
    .label("Data da consulta")
    .validate(req.body.AppointmentDate);

  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  const company = await Prisma.company.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!company) {
    res.status(404).send(Response);
    return;
  }

  Response.Content = await Prisma.apointment.create({
    data: {
      apointmentDate: userv,
      companyId: company.id,
    },
  });

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
