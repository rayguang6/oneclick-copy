// import React from 'react'
// import { getProjects } from '@/app/lib/actions/project.actions'
// import { Project } from '@/app/types/global'
// interface SearchParams {
// searchParams: Promise<{ [key: string]: string }>;
// }

// const ProjectList = async ({ searchParams }: SearchParams) => {

//     const { success, data, error } = await getProjects();
//     console.log(data)

//   return (
//     <div>
//         {data?.map((project: Project) => (
//             <div key={project.id}>
//                 <h1>{project.name}</h1>
//             </div>
//         ))}
//     </div>
//   )
// }

// export default ProjectList