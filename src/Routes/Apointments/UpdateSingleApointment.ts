import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";
import { date } from "yup";

const Prisma = new PrismaClient();

export async function UpdateSingleApointment(req: Request, res: Response) {
  let userv = await date()
    .required()
    .min(Date())
    .label("Data da consulta")
    .validate(req.body.data.AppointmentDate);

  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  try
  {
    await Prisma.apointment.update({
      data: {
        apointmentDate: userv,
      },
      where: {
        id: req.params.id,
      },
    });
  
    Response.Content = userv;
  }
  catch(e)
  {
    
  }

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
