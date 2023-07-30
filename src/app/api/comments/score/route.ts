import prisma from "../../../../../prisma/client";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

const createScoreSchema = z.object({
  commentId: z.string(),
  liked: z.boolean(),
});

export const POST = async (req: NextRequest) => {
  try {
    const user = await getServerSession(authOptions).then(
      (session) => session?.user
    );

    const { commentId, liked } = createScoreSchema.parse(await req.json());

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

    const score = await prisma.score.findFirst({
      where: {
        userId: userDB?.id,
        commentId: commentId,
      },
    });

    if (score) {
      if (score.liked !== liked) {
        await prisma.score.update({
          data: {
            liked: liked,
          },
          where: {
            commentId_userId: {
              userId: userDB?.id!,
              commentId: commentId,
            },
          },
        });

        return NextResponse.json(
          { message: "Score updated." },
          { status: 200 }
        );
      }

      await prisma.score.delete({
        where: {
          commentId_userId: {
            userId: userDB?.id!,
            commentId: commentId,
          },
        },
      });

      return NextResponse.json({ message: "Score deleted." }, { status: 200 });
    }

    await prisma.score.create({
      data: {
        userId: userDB?.id!,
        commentId: commentId,
        liked: liked,
      },
    });

    return NextResponse.json({ message: "Score created." }, { status: 201 });
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
