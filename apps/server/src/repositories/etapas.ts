import { database } from "@/database";
import type { Etapa, Projeto, StepsByProjetoId } from "@/types";

const ETAPA_STATUS = {
  COMPLETED: 1,
  PENDING: 0,
} as const;

const createEmptyProjetoSteps = (projeto: Projeto): StepsByProjetoId => ({
  completed: [],
  id: projeto.id_coleta,
  pending: [],
  steps: [],
  uc: projeto.UCPrincipal_coleta,
});

const initializeStepsByProjetoId = (
  projetos: Projeto[]
): Record<number, StepsByProjetoId> =>
  Object.fromEntries(
    projetos.map((projeto) => [
      projeto.id_coleta,
      createEmptyProjetoSteps(projeto),
    ])
  ) as Record<number, StepsByProjetoId>;

const categorizeStep = (projetoSteps: StepsByProjetoId, step: Etapa): void => {
  projetoSteps.steps.push(step);

  if (step.status_etapa === ETAPA_STATUS.PENDING) {
    projetoSteps.pending.push(step);
  }

  if (step.status_etapa === ETAPA_STATUS.COMPLETED) {
    projetoSteps.completed.push(step);
  }
};

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
): Promise<Record<number, StepsByProjetoId>> => {
  if (projetos.length === 0) {
    return {};
  }

  const projetosId = projetos.map((projeto) => projeto.id_coleta);
  const steps = await findEtapasByProjetoIds(projetosId);
  const stepsByProjetoId = initializeStepsByProjetoId(projetos);

  for (const step of steps) {
    const projetoSteps = stepsByProjetoId[step.cod_coleta_etapa];

    if (!projetoSteps) {
      continue;
    }

    categorizeStep(projetoSteps, step);
  }

  return stepsByProjetoId;
};
