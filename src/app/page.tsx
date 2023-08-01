import CommentsSection from "@/components/CommentsSection";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import { getCommentsData } from "@/helpers/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  const comments = await getCommentsData();

  return (
    <main className="flex flex-col items-center justify-between w-full min-h-screen bg-very-light-gray">
      <Header session={session} />
      <section className="flex flex-col justify-end flex-grow space-y-4 w-full max-w-[46rem] p-4">
        <CommentsSection session={session} comments={comments} />
        <InputForm session={session} />
      </section>
    </main>
  );
};

export default page;
