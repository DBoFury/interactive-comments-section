import { FC, ReactNode, useState } from "react";
import type { Session } from "next-auth";
import { cn, getFallback } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";

const UpdateSchema = z.object({
  text: z
    .string()
    .min(10, {
      message: "Your reply should contain at least 10 symbols",
    })
    .max(300, {
      message: "Reply is too long, try to contain the 300 symbols width",
    }),
});

interface UpdateFormProps {
  commentId: string;
  content: string;
  setOpenedEdit: (value: null) => void;
  scoreElement: ReactNode;
}

const UpdateForm: FC<UpdateFormProps> = ({
  commentId,
  content,
  setOpenedEdit,
  scoreElement,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      text: content,
    },
  });

  const onSubmit = async (data: z.infer<typeof UpdateSchema>) => {
    form.reset();
    setIsLoading(true);

    try {
      const response = await fetch("/api/comments/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, content: data.text }),
      });

      setOpenedEdit(null);
    } catch (error) {
      toast({
        variant: "destructive",
        description: (
          <p className="font-rubik">Something went wrong. Try again later.</p>
        ),
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm left-1/2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    id="comment-edit"
                    aria-describedby=""
                    disabled={isLoading}
                    placeholder="Update your comment..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between pl-1">
            {scoreElement}
            <Button
              disabled={isLoading}
              className={cn(
                "px-6 py-3 ml-auto uppercase bg-moderate-blue hover:bg-light-grayish-blue",
                {
                  "pl-4 pr-2": isLoading,
                }
              )}>
              Update
              {isLoading && (
                <span
                  className="ml-2 h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateForm;
