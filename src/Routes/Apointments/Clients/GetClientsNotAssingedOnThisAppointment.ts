import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseSchema from "../../../Schemas/ResponseSchema";

const Prisma = new PrismaClient();

export async function GetClientsNotAssingedOnThisAppointment(
  req: Request,
  res: Response
) {
  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  const idSearchResult = await Prisma.apointmentPresence.findMany({
    select:{
        interviewClientId:true
    },
    where:{
        apointmentId: req.params.id
    }
  })


  try {
    Response.Content = await Prisma.interviewClient.findMany({
      select: {
        name: true,
        id: true,
        document: true,
      },
      where: {
        NOT:{
            id:{
                in: idSearchResult.map((item) => item.interviewClientId)
            }
        }
      }
    });
  } finally {
    if (Response.Content) Response.Message.Content = "";
    res.send(Response);
  }
}
