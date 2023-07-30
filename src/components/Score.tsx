"use client";

import { FC, useState } from "react";
import { ScoreType } from "@/types";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Button } from "./ui/button";
import type { Session } from "next-auth";
import { cn, findScore } from "@/lib/utils";

interface ScoreProps {
  commentId: string;
  score: ScoreType[];
  session: Session | null;
}

const Score: FC<ScoreProps> = ({ commentId, score, session }) => {
  const [user, setUser] = useState<Session["user"] | null>(
    session?.user || null
  );
  const [scoredByUser, setScoredByUser] = useState<boolean | null>(
    findScore(user, score)
  );

  const [totalScore, setTotalScore] = useState<number>(
    score.reduce((acc, entry) => {
      if (entry.liked) return acc + 1;
      return acc - 1;
    }, 0)
  );

  const [requestInProgress, setRequestInProgress] = useState(false);

  const handleScoreButton = async (liked: boolean) => {
    if (requestInProgress) {
      return;
    }

    try {
      setRequestInProgress(true);

      if (scoredByUser !== null) {
        setTotalScore((prev) => (scoredByUser ? prev - 1 : prev + 1));
        setScoredByUser(null);
      }

      if (scoredByUser !== liked) {
        setScoredByUser(liked);
        setTotalScore((prev) => (liked ? prev + 1 : prev - 1));
      }

      await fetch("/api/comments/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, liked }),
      });
    } catch (error) {
      console.error("Error while processing the request:", error);

      if (scoredByUser !== null) {
        setScoredByUser(!liked);
        setTotalScore((prev) => (scoredByUser ? prev + 1 : prev - 1));
      }
    } finally {
      setRequestInProgress(false);
    }
  };

  return (
    <div className="rounded-lg bg-light-gray">
      <div className="flex items-center justify-center space-x-1">
        <Button
          onClick={() => handleScoreButton(true)}
          variant="ghost"
          className={cn("text-grayish-blue focus:outline-none", {
            "bg-moderate-blue": scoredByUser,
          })}>
          <AiOutlinePlus
            size={16}
            className={cn("", {
              "fill-white": scoredByUser,
            })}
          />
        </Button>
        <span className="w-6 font-semibold text-center select-none text-moderate-blue">
          {totalScore}
        </span>
        <Button
          onClick={() => handleScoreButton(false)}
          variant="ghost"
          className={cn("text-grayish-blue focus:outline-none", {
            "bg-moderate-blue": scoredByUser !== null && !scoredByUser,
          })}>
          <AiOutlineMinus
            size={16}
            className={cn("", {
              "fill-white": scoredByUser !== null && !scoredByUser,
            })}
          />
        </Button>
      </div>
    </div>
  );
};

export default Score;
