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
import { Button } from "@/components/ui/button";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import OAuth from "./OAuth";
import { capitalize, cn } from "@/lib/utils";

interface AuthDialogProps {
  buttonType: "sign in" | "sign up";
  isLoading: "credentials" | "google" | false;
  setIsLoading: (value: "credentials" | "google" | false) => void;
}

const AuthDialog: FC<AuthDialogProps> = ({
  buttonType,
  isLoading,
  setIsLoading,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(
    buttonType === "sign up" ? true : false
  );

  const handleAuthToggle = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonType === "sign in" ? "ghost" : "default"}
          className={cn("text-lg", {
            "hover:bg-slate-200": buttonType === "sign in",
          })}>
          {capitalize(buttonType)}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-md max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isSignUp ? "Sign Up" : "Sign In"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSignUp
              ? "Provide your information to create an \
              account and begin posting comments, or alternatively, \
              select a suitable service to establish a profile."
              : "Enter your login details to access your \
              account and start engaging with the platform. \
              Alternatively, choose a suitable service to sign in \
              with and gain access to your profile."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col p-2 space-y-2">
          {isSignUp ? (
            <SignUp
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              handleAuthToggle={handleAuthToggle}
            />
          ) : (
            <SignIn
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              handleAuthToggle={handleAuthToggle}
            />
          )}
          <div className="inline-flex items-center justify-center w-full">
            <hr className="w-full h-px my-5 translate-y-1/2 bg-gray-300 border-0 dark:bg-gray-700" />
            <span className="absolute px-2 -translate-x-1/2 bg-white text-slate-500 left-1/2">
              Or continue with
            </span>
          </div>
          <OAuth isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
