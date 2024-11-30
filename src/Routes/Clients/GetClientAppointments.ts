import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";
const Prisma = new PrismaClient();

export async function GetClientAppointments(req: Request, res: Response) {
  var Response: ResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: null,
  };

  Response.Content = await Prisma.apointment.findMany({
    where: {
        presences:{
            some:{
                interviewClientId: req.params.id
            }
        }
    },
    orderBy:{
        apointmentDate: "asc"
    },
    include:{
        company:true
    }
  });

  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
