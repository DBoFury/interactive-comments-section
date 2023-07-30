"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const SignUpSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, {
      message: "Email should be longer than 5 symbols",
    })
    .max(50, {
      message: "Email is too long",
    }),
  username: z.string().optional(),
  password: z
    .string()
    .nonempty({ message: "Required" })
    .min(6, { message: "Min length is 6" })
    .max(50, { message: "Max lenght is exceeded (50)" }),
});

interface SignUpProps {
  isLoading: "credentials" | "google" | false;
  setIsLoading: (value: "credentials" | "google" | false) => void;
  handleAuthToggle: () => void;
}

const SignUp: FC<SignUpProps> = ({
  isLoading,
  setIsLoading,
  handleAuthToggle,
}) => {
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsLoading("credentials");
    form.reset();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsLoading(false);

      if (!response.ok) {
        form.setError("email", {
          type: "Exists",
          message: "Such user already exists",
        });
        return;
      }

      const { email, password } = await response.json();

      console.log(email, password);

      await signIn("credentials", { email, password });
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full pt-2 bg-white rounded-lg left-1/2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={!!isLoading}
                    placeholder="Your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={!!isLoading}
                    className="truncate"
                    placeholder="Your username (optional)"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput disabled={!!isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between w-full pl-1">
            <Button
              disabled={!!isLoading}
              variant="link"
              type="button"
              onClick={handleAuthToggle}
              className="p-0 text-sm text-moderate-blue">
              Have an account?
            </Button>
            <Button
              disabled={!!isLoading}
              type="submit"
              className={cn("self-end px-6 py-3 uppercase bg-moderate-blue", {
                "pl-4 pr-2": isLoading === "credentials",
              })}>
              Sign Up
              {isLoading === "credentials" && (
                <span
                  className="ml-2 h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default SignUp;
