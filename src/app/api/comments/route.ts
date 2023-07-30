import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../prisma/client";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const createReqSchema = z.object({
  content: z.string().min(10).max(300),
});

export const POST = async (req: NextRequest) => {
  const user = await getServerSession(authOptions).then((res) => res?.user);

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
};
