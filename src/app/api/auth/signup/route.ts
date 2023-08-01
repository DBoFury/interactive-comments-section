import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { hash, genSalt } from "bcryptjs";
import { ZodError, z } from "zod";

const signUpSchema = z.object({
  email: z.string().email().min(5).max(50),
  username: z.string().optional(),
  password: z.string().nonempty().min(6).max(50),
});

export const POST = async (req: NextRequest) => {
  try {
    const { email, username, password } = signUpSchema.parse(await req.json());

    const hashedPassword = await hash(password, 12);

    const isExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (isExist) {
      throw new Error("User already exists.");
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        email: user.email,
        username: username,
        password: user.password,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          status: "error",
          message: error.message,
        },
        { status: 412 }
      );
    }
    if (error instanceof Error && error.message === "User already exists.") {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json(
      { message: "Something went wrong, try again later." },
      { status: 400 }
    );
  }
};
