import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseSchema from "../../Schemas/ResponseSchema";
import PaginationResponseSchema from "../../Schemas/PaginationResponseSchema";
import PaginationRequestScheme from "../../Schemas/PaginationRequestScheme";

const Prisma = new PrismaClient();

export async function FindNextApointments(req: Request, res: Response) {
  const Pagination = await PaginationRequestScheme(5).validate(req.query);

  var Response: PaginationResponseSchema = {
    Message: {
      Content: "Dados não encontrados!",
      Title: null,
    },
    Content: {
      Meta: {
        count: 0,
        maxPage: 0,
        page: Pagination.page,
        size: Pagination.size,
        search: Pagination.search ?? null,
      },
      Data: [],
    },
  };

  Response.Content.Meta.count = await Prisma.apointment.count({
    where: {
      apointmentDate: {
        gte: new Date(), // Pega registros com data maior ou igual a hoje
      },
    },
  });
  Response.Content.Meta.maxPage = Math.ceil(
    Response.Content.Meta.count / Pagination.size
  );

  Response.Content.Meta.page =
    Pagination.page > Response.Content.Meta.maxPage
      ? Response.Content.Meta.maxPage
      : Pagination.page;

  Response.Content.Data = await Prisma.apointment.findMany({
    where: {
      apointmentDate: {
        gte: new Date(), // Pega registros com data maior ou igual a hoje
      },
    },
    include: {
      company: {},
    },
    take: Pagination.size,
    skip: Pagination.size * (Response.Content.Meta.page - 1),
  });
  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
