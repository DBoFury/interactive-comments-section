export const usernameReply = (repliesTo: string | null) => {
  return repliesTo ? `@${repliesTo} ` : "";
};
