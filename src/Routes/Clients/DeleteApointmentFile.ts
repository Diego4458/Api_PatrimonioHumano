import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";
import { log, warn } from "console";


const fs = require("fs");

const Prisma = new PrismaClient();

export async function DeleteApointmentFile(req: Request, res: Response) {
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
          fileDetails: {
            where: {
              id: req.params.fileId,
            },
          },
        },
      },
    },
  });

  if (
    appointment == null ||
    !appointment.presences ||
    appointment.presences.length <= 0 ||
    !appointment.presences[0].fileDetails ||
    appointment.presences[0].fileDetails.length <= 0
  ) {
    res.send(Response);
    return;
  }

  try {
    fs!.unlinkSync("./Secret/Secured/"+appointment!.presences[0].fileDetails[0].fileHash);
    await Prisma.fileDetails.delete({
        where: {
          id: appointment!.presences[0].fileDetails[0].id,
        },
      });
    Response.Message.Content = "Arquivo Deletado Com Sucesso";
    Response.Content = true;
  } catch (ex) {
    warn(ex);
    Response.Message.Content = "Falha ao Deletar arquivos";
  }

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
