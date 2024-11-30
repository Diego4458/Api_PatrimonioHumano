import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import PaginationResponseSchema from "../../../Schemas/PaginationResponseSchema";
import PaginationRequestScheme from "../../../Schemas/PaginationRequestScheme";
const Prisma = new PrismaClient();

export async function GetAllCompanyApointments(req: Request, res: Response) {
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

  const company = await Prisma.company.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!company) {
    res.status(404).send(Response);
    return;
  }

  Response.Content.Meta.count = await Prisma.apointment.count({
    where: {
      companyId: req.params.id,
    },
  });
  Response.Content.Meta.maxPage = Math.ceil(
    Response.Content.Meta.count / Pagination.size
  );

  Response.Content.Meta.page = Math.max(Pagination.page,Response.Content.Meta.maxPage,1)


  Response.Content.Data = await Prisma.apointment.findMany({
    where: {
      companyId: company?.id,
    },
    include:{
      company:true
    },
    take: Pagination.size,
    skip: Pagination.size * (Response.Content.Meta.page - 1),
  });
  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
