import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";
const Prisma = new PrismaClient();

export async function GetAppointmentFiles(req: Request, res: Response) {
  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  var appointment = await Prisma.apointment.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      presences: {
        where: {
          interviewClientId: req.params.userId,
        },
        include: {
          fileDetails: true,
        },
      },
    },
  });

  if (appointment == null || !appointment.presences || appointment.presences.length <= 0) {
    Response.Message.Content = "Consulta não encontrada";
  } else {
    Response.Content = appointment.presences[0]?.fileDetails;
  }

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
