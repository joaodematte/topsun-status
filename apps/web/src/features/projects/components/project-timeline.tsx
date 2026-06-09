import { IconCheck, IconClock, IconHourglassEmpty } from "@tabler/icons-react";
import type { Project, ProjectStep } from "@topsun-status/shared";
import { cn } from "@topsun-status/ui/lib/utils";

import { MACRO_STEPS } from "@/features/projects/config/steps";

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

export function ProjectTimeline({ project }: { project: Project }) {
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
