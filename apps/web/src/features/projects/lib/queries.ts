import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import type { ProjectsById, ProjectsQuery } from "@topsun-status/shared";

import { fetchProjects } from "@/features/projects/lib/fetch-projects";

export function getProjectsQueryKey(query: ProjectsQuery) {
  return ["projects", query.cpf, query.birthDate] as const;
}

export function getCachedProjects(
  queryClient: QueryClient,
  query: ProjectsQuery
): ProjectsById | undefined {
  return queryClient.getQueryData(getProjectsQueryKey(query));
}

export function projectsQueryOptions(query: ProjectsQuery) {
  return queryOptions({
    queryFn: () => fetchProjects(query),
    queryKey: getProjectsQueryKey(query),
  });
}

export function fetchProjectsMutationOptions(queryClient: QueryClient) {
  return mutationOptions({
    mutationFn: fetchProjects,
    onSuccess: (data, query) => {
      queryClient.setQueryData(getProjectsQueryKey(query), data);
    },
  });
}
