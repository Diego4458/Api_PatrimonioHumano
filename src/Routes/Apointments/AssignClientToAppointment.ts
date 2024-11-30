import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

export async function AssignClientToAppointment(req: Request, res: Response) {
  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  try {
    var appointment = Prisma.apointment.findUnique({
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

    var Client = Prisma.interviewClient.findFirst({
      where: {
        id: req.params.userId,
      },
    });

    const ApointmentResult = await appointment;
    const ClientResult = await Client;

    if (ApointmentResult == null) {
      Response.Message.Content = "Consulta Não Encontrado";
      return;
    }
    else if(ApointmentResult.presences.length > 0)
    {
        Response.Message.Content = "Esse Usuario ja está cadastrado na consulta";
        return;
    }

    if (ClientResult == null) {
      Response.Message.Content = "Usuario Não Encontrado";
      return;
    }

    Response.Content = await Prisma.apointmentPresence.create({
        data:{
            apointmentId: ApointmentResult.id,
            interviewClientId: ClientResult.id,
        }
    });
  } finally {
    if (Response.Content) Response.Message.Content = "";
    res.send(Response);
  }
}
