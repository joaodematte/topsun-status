export const PROJECTS_QUERY_KEY = ["projects"] as const;

export interface ProjectStep {
  cod_cfg_etapa: number;
  status_etapa: number;
  [key: string]: unknown;
}

export interface ProjectSteps {
  completed: ProjectStep[];
  id: number;
  pending: ProjectStep[];
  steps: ProjectStep[];
  uc: string;
}

export type ProjectsById = Record<string, ProjectSteps>;
