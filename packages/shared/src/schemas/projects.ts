import { z } from "zod";

/** Matches DB storage format for cpfcnpj_cliente (e.g. 123.456.789-09). */
const FORMATTED_CPF_PATTERN = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/u;

export const projectsQuerySchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  cpf: z
    .string()
    .regex(FORMATTED_CPF_PATTERN, "CPF must be formatted as 000.000.000-00"),
});

export const projectStepSchema = z.object({
  cod_cfg_etapa: z.number(),
  status_etapa: z.number(),
});

export const projectSchema = z.object({
  id: z.number(),
  steps: z.array(projectStepSchema),
  uc: z.string(),
});

export const projectsByIdSchema = z.record(z.string(), projectSchema);

export type ProjectsQuery = z.infer<typeof projectsQuerySchema>;
export type ProjectStep = z.infer<typeof projectStepSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectsById = z.infer<typeof projectsByIdSchema>;
