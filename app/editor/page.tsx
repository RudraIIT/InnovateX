import { Workspace } from "@/components/workspace";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function CodeEditor({ searchParams }: any) {
  const {template} = await searchParams;
  console.log(template);

  return <Workspace template={template} />;
}
