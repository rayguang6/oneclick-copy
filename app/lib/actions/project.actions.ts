interface Project {
  id: string;
  name: string;
  // Add other project fields as needed
}

export async function getUserProjects(): Promise<Project[]> {
  // TODO: Implement actual project fetching
  console.log('Project fetching not implemented yet');
  return [];
} 