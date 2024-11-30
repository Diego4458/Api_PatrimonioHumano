import crypto from "crypto";

export default function HashPassword(pass:string) : string
{
    return crypto
            .createHash("sha256")
            .update(pass)
            .digest("hex");
}