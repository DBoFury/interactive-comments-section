import { ScoreType } from "@/types";
import { FC } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Button } from "./ui/button";

interface ScoreProps {
  score: ScoreType[];
}

const Score: FC<ScoreProps> = ({ score }) => {
  const totalScore = score.reduce((acc, entry) => {
    if (entry.liked) return acc + 1;
    return acc - 1;
  }, 0);

  return (
    <div className="rounded-lg bg-light-gray">
      <div className="flex items-center justify-center space-x-1">
        <Button
          variant="ghost"
          className="text-grayish-blue focus:outline-none">
          <AiOutlinePlus size={12} />
        </Button>
        <span className="font-medium select-none text-moderate-blue">
          {totalScore}
        </span>
        <Button
          variant="ghost"
          className="text-grayish-blue focus:outline-none">
          <AiOutlineMinus size={12} />
        </Button>
      </div>
    </div>
  );
};

export default Score;
