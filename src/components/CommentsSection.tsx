"use client";

import { FC, Fragment, ReactNode, useState } from "react";
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
  openedEdit: string | null,
  setOpenedEdit: (value: string | null) => void,
  repliesTo: string | null = null,
  depth = 0
): ReactNode[] => {
  return comments.map((comment) => {
    if (comment.replies && comment.replies.length > 0) {
      return (
        <Fragment key={`comments-${comment.id}`}>
          <Comment
            key={comment.id}
            session={session}
            comment={comment}
            repliesTo={repliesTo}
            openedReply={comment.id === openedReply}
            setOpenedReply={setOpenedReply}
            openedEdit={comment.id === openedEdit}
            setOpenedEdit={setOpenedEdit}
          />
          <Comments depth={depth + 1}>
            {getCommentsElements(
              session,
              comment.replies,
              openedReply,
              setOpenedReply,
              openedEdit,
              setOpenedEdit,
              (repliesTo = comment.author.username)
            )}
          </Comments>
        </Fragment>
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
          openedEdit={comment.id === openedEdit}
          setOpenedEdit={setOpenedEdit}
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
  const [openedEdit, setOpenedEdit] = useState<string | null>(null);

  return (
    <ScrollArea className="flex-grow h-0">
      <div className="flex flex-col space-y-4">
        {getCommentsElements(
          session,
          comments,
          openedReply,
          setOpenedReply,
          openedEdit,
          setOpenedEdit
        )}
      </div>
    </ScrollArea>
  );
};

export default CommentsSection;
