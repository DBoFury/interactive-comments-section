import { FC, ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommentType } from "@/types";
import Comments from "./Comments";
import Comment from "./Comment";

const getCommentsElements = (
  comments: CommentType[],
  repliesTo: string | null = null,
  depth = 0
): ReactNode[] => {
  return comments.map((comment) => {
    if (comment.replies && comment.replies.length > 0) {
      return (
        <>
          <Comment key={comment.id} comment={comment} repliesTo={repliesTo} />
          <Comments depth={depth + 1}>
            {getCommentsElements(
              comment.replies,
              (repliesTo = comment.author.username)
            )}
          </Comments>
        </>
      );
    } else {
      return (
        <Comment key={comment.id} comment={comment} repliesTo={repliesTo} />
      );
    }
  });
};

interface CommentSectionProps {
  comments: CommentType[];
}

const CommentsSection: FC<CommentSectionProps> = ({ comments }) => {
  return (
    <ScrollArea className="flex-grow h-0">
      <div className="flex flex-col space-y-4">
        <Comments depth={0}>{getCommentsElements(comments)}</Comments>
      </div>
    </ScrollArea>
  );
};

export default CommentsSection;
