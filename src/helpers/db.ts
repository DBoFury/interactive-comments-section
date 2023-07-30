import prisma from "../../prisma/client";
import { CommentType } from "@/types";

const extendWithReplies = async (comments: CommentType[]) => {
  const modComments = await Promise.all(
    comments.map(async (comment) => {
      if (comment.replies && comment.replies.length > 0) {
        const repliesPromises = comment.replies.map(async ({ id: replyId }) => {
          const reply = await prisma.comment.findUnique({
            select: {
              id: true,
              content: true,
              createdAt: true,
              replies: {
                select: {
                  id: true,
                },
              },
              author: true,
              score: {
                select: {
                  user: {
                    select: {
                      email: true,
                    },
                  },
                  liked: true,
                },
              },
            },
            where: {
              id: replyId,
            },
          });

          return reply;
        });

        const replies = await extendWithReplies(
          (await Promise.all(repliesPromises)) as unknown as CommentType[]
        );

        comment.replies = replies;
      }

      return comment;
    })
  );

  return modComments;
};

export const getCommentsData = async () => {
  const comments = await prisma.comment.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
      replies: {
        select: {
          id: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          image: true,
        },
      },
      score: {
        select: {
          user: {
            select: {
              email: true,
            },
          },
          liked: true,
        },
      },
    },
    where: {
      replyingToId: null,
    },
  });

  const extendedComments = await extendWithReplies(
    comments as unknown as CommentType[]
  );

  return extendedComments;
};
