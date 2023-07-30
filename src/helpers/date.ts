import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const getFormattedDate = async (date: Date) => {
  const formattedDate = `${dayjs(date).fromNow(true)} ago`;

  return formattedDate;
};
