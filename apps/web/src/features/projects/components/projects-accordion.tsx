import type { Project } from "@topsun-status/shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@topsun-status/ui/components/accordion";
import { useState } from "react";

import { ProjectTimeline } from "@/features/projects/components/project-timeline";

export function ProjectsAccordion({ projects }: { projects: Project[] }) {
  const projectsLength = projects.length;

  const [openValues, setOpenValues] = useState<string[]>(() =>
    projectsLength > 0 ? [String(projects[0]?.id)] : []
  );

  const handleChange = (value: string[]) => {
    if (projectsLength === 1) {
      return;
    }

    setOpenValues(value);
  };

  return (
    <Accordion
      className="bg-background mb-8 rounded-4xl shadow-none"
      multiple={false}
      onValueChange={handleChange}
      value={openValues}
    >
      {projects.map((project) => (
        <AccordionItem key={project.id} value={String(project.id)}>
          <AccordionTrigger
            className="p-8 text-base font-bold hover:no-underline"
            showIcon={projectsLength > 1}
          >
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
