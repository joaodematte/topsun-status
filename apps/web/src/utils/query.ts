import { mutationOptions } from "@tanstack/react-query";

import type { ProjectsById } from "@/utils/projects";

interface GetProjectsInput {
  cpf: string;
  birthDate: string;
}

export const mutations = {
  getProjects: () =>
    mutationOptions({
      mutationFn: async (input: GetProjectsInput): Promise<ProjectsById> => {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/projects?${new URLSearchParams({ ...input }).toString()}`
        );

        const payload: unknown = await response.json();

        if (!response.ok) {
          throw new Error(
            "Não foi possível consultar seus projetos. Confira os dados e tente novamente."
          );
        }

        return payload as ProjectsById;
      },
      mutationKey: ["projects"],
    }),
} as const;
