import { User } from "@prisma/client";
const jwtService = require("jsonwebtoken");

export default async function JwtSignResult(user: any): Promise<object> {
  const jwt = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    picHash: user.picHash,
  };

  return await jwtService.sign(jwt, process.env.JWT_TOKEN);
}
