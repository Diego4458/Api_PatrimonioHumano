import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";
const Prisma = new PrismaClient();

export async function UploadAppointmentFiles(req: any, res: Response) {
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
      },
    },
  });

  if (
    appointment == null ||
    !appointment.presences ||
    appointment.presences.length <= 0
  ) {
    Response.Message.Content = "Consulta não encontrada";
    res.send(Response);
    return;
  }

  if (!req.file) {
    Response.Message.Content = "O Arquivo é Nulo";
    res.send(Response);
    return;
  }

  Response.Content = await Prisma.fileDetails.create({
    data: {
      fileName: req.file?.originalname ?? req.file.name,
      fileType: req.file.mimetype,
      size: req.file.size,
      fileHash: req.file.filename,
      companyId: appointment.companyId,
      ApointmentPresenceId: appointment.presences[0].id,
      interviewClientId: appointment.presences[0].interviewClientId,
    },
  });

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
