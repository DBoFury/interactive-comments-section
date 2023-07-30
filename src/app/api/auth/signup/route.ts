import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { hash } from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = (await req.json()) as {
      email: string;
      password: string;
    };

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
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        email: user.email,
        password: user.password,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
      },
      { status: 412 }
    );
  }
};
