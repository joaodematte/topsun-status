import type { RowDataPacket } from "mysql2";

export interface Client extends RowDataPacket {
  id_cliente: number;
}

export interface Projeto extends RowDataPacket {
  id_coleta: number;
  UCPrincipal_coleta: string;
}

export interface Etapa extends RowDataPacket {
  cod_cfg_etapa: number;
  cod_coleta_etapa: number;
  status_etapa: number;
}
