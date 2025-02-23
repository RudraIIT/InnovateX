export const fetchProjectTree = async (template: string) => {
  const res = await fetch(`/api/projects?template=${template}`);
  if (!res.ok) {
      throw new Error('Failed to fetch project tree');
  }
  return res.json();
};