import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultSession["user"] {
    username?: string | null;
  }
}
