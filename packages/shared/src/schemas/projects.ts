import { z } from "zod";

export const projectsQuerySchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  cpf: z.string().min(1),
});

export const projectStepSchema = z
  .object({
    cod_cfg_etapa: z.number(),
    status_etapa: z.number(),
  })
  .catchall(z.unknown());

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
