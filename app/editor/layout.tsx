import { auth } from "@clerk/nextjs/server";

export default async function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn()
  return (
    <>
      {children}
    </>
  );
}
