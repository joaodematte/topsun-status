import type { Project } from "@topsun-status/shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@topsun-status/ui/components/accordion";

import { ProjectTimeline } from "@/features/projects/components/project-timeline";

export function ProjectsAccordion({ projects }: { projects: Project[] }) {
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
            <ProjectTimeline project={project} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
