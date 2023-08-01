"use client";

import { FC, useState } from "react";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn, getFallback } from "@/lib/utils";

const CommentSchema = z.object({
  text: z
    .string()
    .min(10, {
      message: "Your comment should contain at least 10 symbols",
    })
    .max(300, {
      message: "Comment is too long, try to contain the 300 symbols width",
    }),
});

interface InputFormProps {
  session: Session | null;
}

const InputForm: FC<InputFormProps> = ({ session }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CommentSchema>) => {
    form.reset();
    setIsLoading(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: data.text }),
      });

      toast({
        description: (
          <p className="font-rubik">
            Your comment has been submitted{" "}
            <span className="absolute bottom-[27px] pl-1">👍</span>
          </p>
        ),
        duration: 2000,
      });
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
                    id="comment"
                    aria-describedby=""
                    disabled={!!!session || isLoading}
                    placeholder="Add a comment..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between pl-1">
            {!!session ? (
              <Avatar>
                <AvatarImage
                  src={session.user.image ?? ""}
                  alt={`@${session.user.username}`}
                />
                <AvatarFallback>{getFallback(session.user)}</AvatarFallback>
              </Avatar>
            ) : (
              <></>
            )}
            <Button
              disabled={!!!session || isLoading}
              type="submit"
              className={cn(
                "px-6 py-3 ml-auto uppercase bg-moderate-blue hover:bg-light-grayish-blue",
                {
                  "pl-4 pr-2": isLoading,
                }
              )}>
              Send
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

export default InputForm;
