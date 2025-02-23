import { Workspace } from "@/components/workspace";

interface WorkspacePageProps {
  params: Promise<{ id: string; }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { id } = await params;
  return (
    <Workspace initialId={id} />
  )
}
