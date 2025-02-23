import { Workspace } from "@/components/workspace";

export default async function CodeEditor({ searchParams }: any) {
  const {template} = await searchParams;
  console.log(template);

  return <Workspace template={template} />;
}
