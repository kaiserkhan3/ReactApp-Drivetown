import { ResponseDto } from "@/models/user.model";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: ResponseDto;
  }
}
