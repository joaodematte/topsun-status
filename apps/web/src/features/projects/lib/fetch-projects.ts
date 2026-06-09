import { projectsByIdSchema } from "@topsun-status/shared";
import type { ProjectsById, ProjectsQuery } from "@topsun-status/shared";

const FETCH_ERROR_MESSAGE =
  "Não foi possível consultar seus projetos. Confira os dados e tente novamente.";

export async function fetchProjects(
  query: ProjectsQuery
): Promise<ProjectsById> {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/projects?${new URLSearchParams(query).toString()}`
  );

  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error(FETCH_ERROR_MESSAGE);
  }

  return projectsByIdSchema.parse(payload);
}
