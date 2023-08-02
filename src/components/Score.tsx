"use client";

import { FC, useState } from "react";
import { ScoreType } from "@/types";
import { Button } from "./ui/button";
import type { Session } from "next-auth";
import { cn, findScore } from "@/lib/utils";
import { Icons } from "./Icons";

interface ScoreProps {
  commentId: string;
  score: ScoreType[];
  sessionUser: Session["user"] | null;
}

const Score: FC<ScoreProps> = ({ commentId, score, sessionUser }) => {
  const [user, _] = useState<Session["user"] | null>(sessionUser || null);
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
      if (scoredByUser !== null) {
        setScoredByUser(!liked);
        setTotalScore((prev) => (scoredByUser ? prev + 1 : prev - 1));
      }
    } finally {
      setRequestInProgress(false);
    }
  };

  return (
    <div className="rounded-lg bg-very-light-gray">
      <div className="flex items-center justify-center space-x-1 sm:flex-col sm:space-x-0 sm:space-y-1">
        <Button
          type="button"
          disabled={!!!user}
          onClick={() => handleScoreButton(true)}
          variant="ghost"
          className={cn("group text-grayish-blue focus:outline-none", {
            "bg-moderate-blue": scoredByUser,
          })}>
          <Icons.plus
            className={cn("fill-grayish-blue group-hover:fill-moderate-blue", {
              "fill-white": scoredByUser,
            })}
          />
        </Button>
        <span className="w-6 font-semibold text-center select-none text-moderate-blue">
          {totalScore}
        </span>
        <Button
          type="button"
          disabled={!!!user}
          onClick={() => handleScoreButton(false)}
          variant="ghost"
          className={cn("text-grayish-blue focus:outline-none", {
            "bg-moderate-blue": scoredByUser !== null && !scoredByUser,
          })}>
          <Icons.minus
            className={cn("fill-grayish-blue group-hover:fill-moderate-blue", {
              "fill-white": scoredByUser !== null && !scoredByUser,
            })}
          />
        </Button>
      </div>
    </div>
  );
};

export default Score;
