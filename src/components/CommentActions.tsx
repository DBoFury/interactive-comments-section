"use client";

import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Icons } from "./Icons";
import { cn } from "@/lib/utils";

interface CommentActionsProps {
  commentId: string;
  isEdited: boolean;
  setOpenedEdit: (value: string) => void;
}

const CommentActions: FC<CommentActionsProps> = ({
  commentId,
  isEdited,
  setOpenedEdit,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleEditClick = () => {
    setOpenedEdit(commentId);
  };

  const handleDeleteClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
        }),
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-5">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            aria-controls="open delete dialog"
            variant="ghost"
            className="flex items-center justify-center px-1 space-x-1 group text-soft-red hover:bg-transparent">
            <Icons.delete className="fill-soft-red group-hover:fill-pale-red" />
            <span className="text-lg font-medium group-hover:text-pale-red">
              Delete
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-md max-w-[330px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left text-dark-blue">
              Delete comment
            </DialogTitle>
            <DialogDescription className="pt-5 text-left">
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-between">
            <Button
              aria-controls="cancel delete"
              disabled={isLoading}
              onClick={() => setOpen(false)}
              className="px-6 uppercase bg-grayish-blue hover:bg-gray-400">
              No, cancel
            </Button>
            <Button
              aria-controls="delete"
              disabled={isLoading}
              onClick={handleDeleteClick}
              className={cn("px-6 uppercase bg-soft-red hover:bg-pale-red", {
                "pl-4 pr-2": isLoading,
              })}>
              Yes, delete
              {isLoading && (
                <span
                  className="ml-2 h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        aria-controls="edit"
        disabled={isEdited}
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
