import { IconCheck, IconClock, IconHourglassEmpty } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@topsun-status/ui/components/accordion";
import { Button } from "@topsun-status/ui/components/button";
import { cn } from "@topsun-status/ui/lib/utils";

import { MACRO_STEPS } from "@/config/steps";
import type { ProjectStep, ProjectSteps, ProjectsById } from "@/utils/projects";
import { PROJECTS_QUERY_KEY } from "@/utils/projects";

export const Route = createFileRoute("/steps")({
  component: StepsComponent,
  head: () => ({
    meta: [
      {
        title: "Andamento de seus projetos — TOPSUN Energia",
      },
    ],
  }),
});

const COMPLETED_STEP_STATUS = 1;

type MacroStepStatus = "active" | "completed" | "pending";

const statusCopy = {
  active: "Em andamento",
  completed: "Concluído",
  pending: "Pendente",
} as const satisfies Record<MacroStepStatus, string>;

const statusIconClassName = {
  active: "bg-yellow-300 text-yellow-600",
  completed: "bg-green-500 text-white",
  pending: "bg-muted text-muted-foreground",
} as const satisfies Record<MacroStepStatus, string>;

function getMacroStepStatus(
  steps: ProjectStep[],
  subSteps: readonly number[]
): MacroStepStatus {
  const startedStepIds = new Set<number>();
  const completedStepIds = new Set<number>();

  for (const step of steps) {
    startedStepIds.add(step.cod_cfg_etapa);

    if (step.status_etapa === COMPLETED_STEP_STATUS) {
      completedStepIds.add(step.cod_cfg_etapa);
    }
  }

  const allSubStepsCompleted = subSteps.every((stepId) =>
    completedStepIds.has(stepId)
  );

  if (allSubStepsCompleted) {
    return "completed";
  }

  const hasStartedSubStep = subSteps.some((stepId) =>
    startedStepIds.has(stepId)
  );

  if (hasStartedSubStep) {
    return "active";
  }

  return "pending";
}

function getMacroStepDescription(
  macroStep: (typeof MACRO_STEPS)[number],
  status: MacroStepStatus
): string {
  if (status === "completed") {
    return macroStep.completedDescription;
  }

  if (status === "active") {
    return macroStep.activeDescription;
  }

  return macroStep.pendingDescription;
}

function StatusIcon({ status }: { status: MacroStepStatus }) {
  let Icon = IconHourglassEmpty;

  if (status === "completed") {
    Icon = IconCheck;
  }

  if (status === "active") {
    Icon = IconClock;
  }

  return (
    <span
      aria-label={statusCopy[status]}
      className={cn(
        "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
        statusIconClassName[status]
      )}
      title={statusCopy[status]}
    >
      <Icon aria-hidden="true" className="size-5" />
    </span>
  );
}

function ProjectTimelineContent({ project }: { project: ProjectSteps }) {
  return (
    <ol className="flex flex-col">
      {MACRO_STEPS.map((macroStep, index) => {
        const status = getMacroStepStatus(project.steps, macroStep.subSteps);
        const description = getMacroStepDescription(macroStep, status);
        const isLastItem = index === MACRO_STEPS.length - 1;

        return (
          <li className="relative flex gap-4 pb-7 last:pb-0" key={macroStep.id}>
            {!isLastItem && (
              <span
                aria-hidden="true"
                className="bg-border absolute top-10 left-5 h-full w-px"
              />
            )}
            <StatusIcon status={status} />
            <div className="flex min-w-0 flex-col gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-pretty">
                  {macroStep.title}
                </h3>
                <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium">
                  {statusCopy[status]}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ProjectsAccordion({ projects }: { projects: ProjectSteps[] }) {
  const defaultValue = projects.length > 0 ? [String(projects[0]?.id)] : [];

  return (
    <Accordion
      className="bg-background mb-8 rounded-4xl shadow-none"
      defaultValue={defaultValue}
      multiple
    >
      {projects.map((project) => (
        <AccordionItem key={project.id} value={String(project.id)}>
          <AccordionTrigger className="p-8 text-base font-bold hover:no-underline">
            <span className="flex min-w-0 flex-col gap-1 text-left">
              <span className="text-lg font-bold">Projeto {project.id}</span>
              <span className="text-muted-foreground font-medium">
                UC: {project.uc}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-8 pb-8">
            <ProjectTimelineContent project={project} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function EmptyStepsState() {
  return (
    <>
      <div className="mx-auto mb-12 w-full max-w-lg">
        <h1 className="text-primary-foreground mb-4 text-center text-4xl font-extrabold">
          Consulta expirada
        </h1>
        <p className="text-primary-foreground/85 mx-auto text-center text-lg">
          Faça uma nova consulta para visualizar o andamento dos seus projetos.
        </p>
      </div>

      <Button
        className="mb-1 h-12 w-full text-base font-bold"
        variant="outline"
        render={<Link to="/" />}
      >
        Nova consulta
      </Button>
    </>
  );
}

function StepsComponent() {
  const queryClient = useQueryClient();
  const projects = queryClient.getQueryData<ProjectsById>(PROJECTS_QUERY_KEY);
  const projectEntries: [string, ProjectSteps][] = projects
    ? Object.entries(projects)
    : [];

  projectEntries.sort(
    ([firstProjectId], [secondProjectId]) =>
      Number(firstProjectId) - Number(secondProjectId)
  );

  if (projectEntries.length === 0) {
    return <EmptyStepsState />;
  }

  return (
    <div className="relative z-10 container mx-auto max-w-2xl">
      <div className="mx-auto mb-12 w-full max-w-lg">
        <h1 className="text-primary-foreground mb-4 text-center text-4xl font-extrabold text-pretty">
          Andamento de seus projetos
        </h1>
        <p className="text-primary-foreground/85 mx-auto text-center text-lg">
          Acompanhe as principais etapas dos seus projetos com a TOPSUN!
        </p>
      </div>

      <ProjectsAccordion
        projects={projectEntries.map(([, project]) => project)}
      />
    </div>
  );
}
