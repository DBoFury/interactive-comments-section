"use client";

import { FC } from "react";
import { Button } from "./ui/button";
import { Icons } from "./Icons";

interface CommentActionsProps {
  commentId: string;
  setOpenedEdit: (value: string) => void;
}

const CommentActions: FC<CommentActionsProps> = ({
  commentId,
  setOpenedEdit,
}) => {
  const handleEditClick = () => {
    setOpenedEdit(commentId);
  };

  return (
    <div className="flex items-center justify-center space-x-5">
      <Button
        variant="ghost"
        className="flex items-center justify-center px-1 space-x-1 group text-soft-red hover:bg-transparent">
        <Icons.delete className="fill-soft-red group-hover:fill-pale-red" />
        <span className="text-lg font-medium group-hover:text-pale-red">
          Delete
        </span>
      </Button>
      <Button
        onClick={handleEditClick}
        variant="ghost"
        className="flex items-center justify-center px-1 space-x-1 group text-moderate-blue hover:bg-transparent">
        <Icons.edit className="fill-moderate-blue group-hover:fill-light-grayish-blue" />
        <span className="text-lg font-medium group-hover:text-light-grayish-blue">
          Edit
        </span>
      </Button>
    </div>
  );
};

export default CommentActions;
