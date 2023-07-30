"use client";

import { FC } from "react";
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
import { getFallback } from "@/lib/utils";

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
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CommentSchema>) => {
    form.reset();

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: data.text }),
    });

    const result = await response.json();

    toast({
      description: (
        <p className="font-rubik">
          {result}
          {/* Your comment has been submitted{" "}
          <span className="absolute bottom-[27px] pl-1">👍</span> */}
        </p>
      ),
      duration: 2000,
    });
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
                    disabled={!!!session}
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
              disabled={!!!session}
              type="submit"
              className="px-6 py-3 ml-auto uppercase bg-moderate-blue">
              Send
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InputForm;
