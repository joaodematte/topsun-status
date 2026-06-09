import type { Project } from "@topsun-status/shared";

import { database } from "@/database";
import type { Etapa, Projeto } from "@/types";

const createEmptyProject = (projeto: Projeto): Project => ({
  id: projeto.id_coleta,
  steps: [],
  uc: projeto.UCPrincipal_coleta,
});

const initializeProjectsById = (projetos: Projeto[]): Record<number, Project> =>
  Object.fromEntries(
    projetos.map((projeto) => [projeto.id_coleta, createEmptyProject(projeto)])
  ) as Record<number, Project>;

const findEtapasByProjetoIds = async (
  projetosId: number[]
): Promise<Etapa[]> => {
  const placeholders = projetosId.map(() => "?").join(", ");
  const [steps] = await database.execute<Etapa[]>(
    `SELECT * FROM etapas WHERE cod_coleta_etapa IN (${placeholders})`,
    projetosId
  );

  return steps;
};

export const getEtapasByProjetosId = async (
  projetos: Projeto[]
): Promise<Record<number, Project>> => {
  if (projetos.length === 0) {
    return {};
  }

  const projetosId = projetos.map((projeto) => projeto.id_coleta);
  const steps = await findEtapasByProjetoIds(projetosId);
  const projectsById = initializeProjectsById(projetos);

  for (const step of steps) {
    const project = projectsById[step.cod_coleta_etapa];

    if (!project) {
      continue;
    }

    project.steps.push(step);
  }

  return projectsById;
};
