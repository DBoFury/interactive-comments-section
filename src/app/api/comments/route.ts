import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../prisma/client";
import { ZodError, z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const createReqSchema = z.object({
  content: z.string().min(10).max(300),
});

export const POST = async (req: NextRequest) => {
  try {
    const user = await getServerSession(authOptions).then(
      (session) => session?.user
    );

    const { content } = createReqSchema.parse(await req.json());

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized to perform this action.",
        },
        { status: 401 }
      );
    }

    const userDB = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    const createdComment = await prisma.comment.create({
      data: {
        content: content,
        authorId: userDB?.id!,
      },
    });

    return NextResponse.json(
      { id: createdComment.id, message: "Created." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong. Try again later." },
      { status: 400 }
    );
  }
};
