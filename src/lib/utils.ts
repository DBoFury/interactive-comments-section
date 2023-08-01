import { ScoreType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import type { Session } from "next-auth";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const capitalize = (str: string) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
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

export const findScore = (user: Session["user"] | null, score: ScoreType[]) => {
  if (!!user) {
    const foundElement = score.find(
      (element) => element.user.email === user.email
    );
    return foundElement ? foundElement.liked : null;
  }
  return null;
};
