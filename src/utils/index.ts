import crypto from "crypto";
// ? Dotenv import and config
import * as dotenv from "dotenv";
dotenv.config();
// ? End of Dotenv import and config

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.SECRET as string)
    .digest("hex");
};
