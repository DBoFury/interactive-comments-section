import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../../prisma/client";
import { ZodError, z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const createReplySchema = z.object({
  commentId: z.string(),
  content: z.string().min(10).max(300),
});

export const POST = async (req: NextRequest) => {
  try {
    const user = await getServerSession(authOptions).then(
      (session) => session?.user
    );

    const { commentId, content } = createReplySchema.parse(await req.json());

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

    const replyingToComment = await prisma.comment.findFirst({
      where: { id: commentId },
    });

    if (replyingToComment?.authorId === userDB?.id) {
      throw new Error("Cannot reply to your own comment!");
    }

    const comment = await prisma.comment.create({
      data: {
        authorId: userDB?.id!,
        content: content,
        replyingToId: commentId,
      },
    });

    return NextResponse.json({ message: "Reply submitted." }, { status: 201 });
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
