import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";
import { object, string } from "yup";

const Prisma = new PrismaClient();

const PutAppointmentValidantion = object({
  testResult: string()
    .nullable()
    .oneOf(["Não Avaliado", "apto", "apto restrito", "inapto"]),
  wasPresent: string()
    .nullable()
    .oneOf(["Não Informado", "faltou", "compareceu", "remarcou"]),
});

export async function UpdateClientPressence(req: Request, res: Response) {
  var validated = await PutAppointmentValidantion.validate(req.body.data);

  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  try {
    if (!validated.testResult && !validated.wasPresent) {
      Response.Message.Content =
        "É nescessário que dados sejam inseridos para que haja a atualização!";
      return;
    }

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

    if (appointment == null) {
      Response.Message.Content = "Consulta Não Encontrado";
      return;
    } else if (appointment!.presences.length <= 0) {
      Response.Message.Content = "Esse Usuario não está presente na consulta";
      return;
    }

    const updateData: any = {};
    if (validated.testResult) {
      updateData.testResult = { set: validated.testResult };
    }
    if (validated.wasPresent) {
      updateData.wasPresent = { set: validated.wasPresent };
    }

    // Realiza a atualização no Prisma
    Response.Content = await Prisma.apointmentPresence.update({
      data: updateData,
      where: {
        id: appointment!.presences[0].id
      },
      include:{
        Client:{
            
        }
      }
    });
  } finally {
    if (Response.Content) Response.Message.Content = "";
    res.send(Response);
  }
}
