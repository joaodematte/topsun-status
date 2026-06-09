import { database } from "@/database";
import type { Projeto } from "@/types";

export const findActiveProjetosByClientId = async (
  clientId: number
): Promise<Projeto[]> => {
  const [projetos] = await database.execute<Projeto[]>(
    "SELECT * FROM coleta_dados WHERE cliente_coleta = ? AND status_coleta > 1 AND status_coleta <> 3",
    [clientId]
  );

  return projetos;
};
