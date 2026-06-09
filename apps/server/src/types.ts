import type { RowDataPacket } from "mysql2";

export interface Client extends RowDataPacket {
  id_cliente: number;
}

export interface Projeto extends RowDataPacket {
  id_coleta: number;
  UCPrincipal_coleta: string;
}

export interface Etapa extends RowDataPacket {
  cod_coleta_etapa: number;
  status_etapa: number;
}

export interface StepsByProjetoId {
  id: number;
  uc: string;
  steps: Etapa[];
  pending: Etapa[];
  completed: Etapa[];
}
