import type { Project } from "@topsun-status/shared";

import { AppError } from "@/errors";
import { findClientByCpfAndBirthDate } from "@/repositories/clientes";
import { getEtapasByProjetosId } from "@/repositories/etapas";
import { findActiveProjetosByClientId } from "@/repositories/projetos";

export const getProjetosSteps = async (
  cpf: string,
  birthDate: string
): Promise<Record<number, Project>> => {
  const client = await findClientByCpfAndBirthDate(cpf, birthDate);

  if (!client) {
    throw AppError.clientNotFound();
  }

  const projetos = await findActiveProjetosByClientId(client.id_cliente);

  if (projetos.length === 0) {
    throw AppError.projectsNotFound();
  }

  return getEtapasByProjetosId(projetos);
};
