"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FiMenu } from "react-icons/fi";
import SignUp from "@/components/auth/SignUp";
import { FC, useState } from "react";
import SignIn from "@/components/auth/SignIn";
import OAuth from "./auth/OAuth";
import { Button } from "./ui/button";
import AuthDialog from "./auth/AuthDialog";

interface NavMenuProps {
  isLoading: "credentials" | "google" | false;
  setIsLoading: (value: "credentials" | "google" | false) => void;
}

const NavMenu: FC<NavMenuProps> = ({ isLoading, setIsLoading }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);

  const handleAuthToggle = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <>
      <ul className="hidden space-x-2 sm:flex">
        <li>
          <AuthDialog
            buttonType="sign in"
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </li>
        <li>
          <AuthDialog
            buttonType="sign up"
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </li>
      </ul>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            aria-controls=""
            className="p-2 h-fit sm:hidden"
            variant="ghost">
            <FiMenu size={30} />
          </Button>
        </SheetTrigger>
        <SheetContent className="font-rubik">
          <SheetHeader>
            <SheetTitle className="text-center">
              {isSignUp ? "Sign Up" : "Sign In"}
            </SheetTitle>
            <SheetDescription>
              <p className="text-center">
                {isSignUp
                  ? "Provide your information to create an account and begin posting comments, or alternatively, select a suitable service to establish a profile."
                  : "Enter your login details to access your account and start engaging with the platform. Alternatively, choose a suitable service to sign in with and gain access to your profile."}
              </p>
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
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
          </div>
          <OAuth isLoading={isLoading} setIsLoading={setIsLoading} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NavMenu;
