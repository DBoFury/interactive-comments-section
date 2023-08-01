import { FC } from "react";
import Score from "./Score";
import { getFormattedDate } from "@/helpers/date";
import { CommentType } from "@/types";
import { Button } from "./ui/button";
import type { Session } from "next-auth";
import ReplyForm from "./ReplyForm";
import { Icons } from "./Icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getFallback } from "@/lib/utils";
import CommentActions from "./CommentActions";
import UpdateForm from "./UpdateForm";

interface CommentProps {
  comment: CommentType;
  repliesTo: string | null;
  session: Session | null;
  openedReply: boolean;
  setOpenedReply: (value: string | null) => void;
  openedEdit: boolean;
  setOpenedEdit: (value: string | null) => void;
}

const Comment: FC<CommentProps> = ({
  comment,
  repliesTo,
  session,
  openedReply,
  setOpenedReply,
  openedEdit,
  setOpenedEdit,
}) => {
  const { author } = comment;

  const scoreElement = (
    <Score
      sessionUser={session?.user || null}
      commentId={comment.id}
      score={comment.score}
    />
  );

  return (
    <>
      <div className="relative bg-white rounded-md shadow-sm">
        <div className="p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={author.image} alt={`@${author.username}`} />
                <AvatarFallback>{getFallback(author!)}</AvatarFallback>
              </Avatar>
              <p className="font-semibold text-dark-blue">{author.username}</p>
              {session && session.user.email === author.email && (
                <span className="px-2 pb-px text-sm font-medium text-white rounded-sm bg-moderate-blue">
                  you
                </span>
              )}
              {/* <p className="text-grayish-blue">
            {getFormattedDate(comment.createdAt)}
          </p> */}
            </div>
            {openedEdit ? (
              <UpdateForm
                commentId={comment.id}
                content={comment.content}
                setOpenedEdit={setOpenedEdit}
                scoreElement={scoreElement}
              />
            ) : (
              <div className="flex flex-col space-y-5">
                <p className="text-grayish-blue">
                  {repliesTo && (
                    <span className="font-medium text-moderate-blue">{`@${repliesTo} `}</span>
                  )}
                  {comment.content}
                </p>
                <div className="flex items-center justify-between">
                  {scoreElement}
                  {openedReply ? (
                    <Button
                      onClick={() => setOpenedReply(null)}
                      variant="ghost"
                      className="flex items-center justify-center group text-moderate-blue hover:bg-transparent">
                      <Icons.close className="text-moderate-blue group-hover:text-light-grayish-blue" />
                      <span className="text-lg font-medium group-hover:text-light-grayish-blue">
                        Close
                      </span>
                    </Button>
                  ) : session?.user.email === author.email ? (
                    <CommentActions
                      commentId={comment.id}
                      setOpenedEdit={setOpenedEdit}
                    />
                  ) : (
                    <Button
                      disabled={!!!session}
                      onClick={() => setOpenedReply(comment.id)}
                      variant="ghost"
                      className="flex items-center justify-center space-x-1 group text-moderate-blue hover:bg-transparent">
                      <Icons.reply className="fill-moderate-blue group-hover:fill-light-grayish-blue" />
                      <span className="text-lg font-medium group-hover:text-light-grayish-blue">
                        Reply
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {openedReply && (
        <ReplyForm
          commentId={comment.id}
          replyingTo={comment.author.username}
          user={session?.user || null}
          setOpenedReply={setOpenedReply}
        />
      )}
    </>
  );
};

export default Comment;
