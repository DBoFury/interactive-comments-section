"use client";

import { FC } from "react";
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
  password: z
    .string()
    .nonempty({ message: "Required" })
    .min(6, { message: "Min length is 6" })
    .max(50, { message: "Max lenght is exceeded (50)" }),
});

interface SignInProps {
  isLoading: "credentials" | "google" | false;
  setIsLoading: (value: "credentials" | "google" | false) => void;
  handleAuthToggle: () => void;
}

const SignIn: FC<SignInProps> = ({
  isLoading,
  setIsLoading,
  handleAuthToggle,
}) => {
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsLoading("credentials");
    form.reset();
    try {
      const { email, password } = data;

      await signIn("credentials", { email, password });
    } catch (error: any) {
      // TODO: handle errors
    } finally {
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
              className="p-0 text-moderate-blue">
              Create an account?
            </Button>
            <Button
              disabled={!!isLoading}
              type="submit"
              className={cn("self-end px-6 py-3 uppercase bg-moderate-blue", {
                "pl-4 pr-2": isLoading === "credentials",
              })}>
              Sign In
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

export default SignIn;
