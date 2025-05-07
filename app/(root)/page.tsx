import { getProjects } from "../../lib/actions/project.actions";
import DataRenderer from "../components/DataRenderer";
import { EMPTY_PROJECTS } from "../constants/states";
import ProjectCard from "../components/projects/ProjectCard";

export default async function Home({searchParams}: RouteParams ) {

  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getProjects({  
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { projects } = data || {};
  console.log("projects from home page", projects);
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Projects</h1>
        <p className="text-gray-500 mt-1">Manage and organize all your projects</p>
      </header>
      
      <DataRenderer
        success={success}
        error={error}
        data={projects}
        empty={EMPTY_PROJECTS}
        render={(projects) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      />
    </div>
  );
}