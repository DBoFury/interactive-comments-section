"use client";

import { FC, ReactNode, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommentType } from "@/types";
import type { Session } from "next-auth";
import Comments from "./Comments";
import Comment from "./Comment";

const getCommentsElements = (
  session: Session | null,
  comments: CommentType[],
  openedReply: string | null,
  setOpenedReply: (value: string | null) => void,
  repliesTo: string | null = null,
  depth = 0
): ReactNode[] => {
  return comments.map((comment) => {
    if (comment.replies && comment.replies.length > 0) {
      return (
        <>
          <Comment
            key={comment.id}
            session={session}
            comment={comment}
            repliesTo={repliesTo}
            openedReply={comment.id === openedReply}
            setOpenedReply={setOpenedReply}
          />
          <Comments depth={depth + 1}>
            {getCommentsElements(
              session,
              comment.replies,
              openedReply,
              setOpenedReply,
              (repliesTo = comment.author.username)
            )}
          </Comments>
        </>
      );
    } else {
      return (
        <Comment
          key={comment.id}
          session={session}
          comment={comment}
          repliesTo={repliesTo}
          openedReply={comment.id === openedReply}
          setOpenedReply={setOpenedReply}
        />
      );
    }
  });
};

interface CommentSectionProps {
  comments: CommentType[];
  session: Session | null;
}

const CommentsSection: FC<CommentSectionProps> = ({ comments, session }) => {
  const [openedReply, setOpenedReply] = useState<string | null>(null);

  return (
    <ScrollArea className="flex-grow h-0">
      <div className="flex flex-col space-y-4">
        <Comments depth={0}>
          {getCommentsElements(session, comments, openedReply, setOpenedReply)}
        </Comments>
      </div>
    </ScrollArea>
  );
};

export default CommentsSection;
