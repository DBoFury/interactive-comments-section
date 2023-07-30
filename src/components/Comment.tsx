import Image from "next/image";
import { FC } from "react";
import Score from "./Score";
import ReplyIcon from "./ui/ReplyIcon";
import { getFormattedDate } from "@/helpers/date";
import { CommentType } from "@/types";
import { Button } from "./ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface CommentProps {
  comment: CommentType;
  repliesTo: string | null;
}

const Comment: FC<CommentProps> = async ({ comment, repliesTo }) => {
  const session = await getServerSession(authOptions);
  const { author: user } = comment;

  return (
    <div className="relative bg-white rounded-md shadow-sm">
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-start space-x-3">
            <Image
              src={user.image}
              alt={`${user.username} profile image`}
              width={30}
              height={30}
              className="rounded-full"
            />
            {/* <p className="font-semibold text-dark-blue">{user.username}</p> */}
            {/* <p className="text-grayish-blue">
              {getFormattedDate(comment.createdAt)}
            </p> */}
          </div>
          <p className="text-grayish-blue">
            {repliesTo && (
              <span className="font-medium text-moderate-blue">{`@${repliesTo} `}</span>
            )}
            {comment.content}
          </p>
          <div className="flex items-center justify-between">
            <Score
              session={session}
              commentId={comment.id}
              score={comment.score}
            />
            <Button
              variant="ghost"
              className="flex items-center justify-center space-x-1 text-moderate-blue">
              <ReplyIcon />
              <span className="text-lg font-medium">Reply</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
