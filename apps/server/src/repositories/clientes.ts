import { database } from "@/database";
import type { Client } from "@/types";

export const findClientByCpfAndBirthDate = async (
  cpf: string,
  birthDate: string
): Promise<Client | null> => {
  const [clients] = await database.execute<Client[]>(
    "SELECT * FROM clientes WHERE cpfcnpj_cliente = ? AND nasc_abertura_cliente = ?",
    [cpf, birthDate]
  );

  return clients[0] ?? null;
};
