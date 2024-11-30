import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import PaginationRequestScheme from "../../Schemas/PaginationRequestScheme";
import PaginationResponseSchema from "../../Schemas/PaginationResponseSchema";
import { DocumentValidation } from "../../Utils/DocumentValidation";
const Prisma = new PrismaClient();

export async function GetAllClients(req: Request, res: Response) {
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

  const Search: any = {};

  if (Pagination.search) {
    if (DocumentValidation(Pagination.search)) {
      Search.document = {
        contains: Pagination!.search,
      };
    }
    else
    {
      Search.name = {
        contains: Pagination!.search,
      };
    }
  }

  Response.Content.Meta.count = await Prisma.interviewClient.count({
    where: Search,
  });

  Response.Content.Meta.maxPage = Math.max(
    Math.ceil(Response.Content.Meta.count / Pagination.size),
    1
  );

  Response.Content.Meta.page =
    Pagination.page > Response.Content.Meta.maxPage
      ? Response.Content.Meta.maxPage
      : Pagination.page;

  Response.Content.Data = await Prisma.interviewClient.findMany({
    where: Search,
    take: Pagination.size,
    skip: Pagination.size * (Response.Content.Meta.page - 1),
  });
  if (Response.Content) Response.Message.Content = "";
  res.send(Response);
}
