import { Prompt } from "@/components/prompt";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();
  return (
    <div className="">
        <Prompt />
    </div>
  );
}