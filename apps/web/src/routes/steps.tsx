import { createFileRoute } from "@tanstack/react-router";
import { projectsQuerySchema } from "@topsun-status/shared";

import { StepsPage } from "@/features/projects/components/steps-page";

export const Route = createFileRoute("/steps")({
  component: StepsRoute,
  head: () => ({
    meta: [
      {
        title: "Andamento de seus projetos — TOPSUN Energia",
      },
    ],
  }),
  validateSearch: (search) => {
    const result = projectsQuerySchema.safeParse(search);

    return result.success ? result.data : undefined;
  },
});

function StepsRoute() {
  const query = Route.useSearch();

  return <StepsPage query={query} />;
}
