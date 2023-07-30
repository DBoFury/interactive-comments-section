import { type ClassValue, clsx } from "clsx";
import { Session } from "next-auth";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getFallback = (user: Session["user"]) => {
  if (user.name) {
    return user.name
      .split(" ")
      .slice(0, 2)
      .map((item) => item.charAt(0))
      .join("")
      .toLocaleUpperCase();
  }

  return user.username
    ?.split(".")
    .slice(0, 2)
    .map((item) => item.charAt(0))
    .join("")
    .toLocaleUpperCase();
};
