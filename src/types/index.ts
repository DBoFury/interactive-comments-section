export type UserType = {
  id: string;
  email: string;
  username: string;
  image: string;
};

export type CommentType = {
  id: string;
  content: string;
  createdAt: Date;
  replies: CommentType[];
  author: UserType;
  score: ScoreType[];
};

export type ScoreType = {
  user: {
    email: string;
  };
  liked: boolean;
};
