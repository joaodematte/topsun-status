import {
  IconAlertCircleFilled,
  IconHelpFilled,
  IconPlusFilled,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ProjectsQuery } from "@topsun-status/shared";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@topsun-status/ui/components/alert";
import { Button } from "@topsun-status/ui/components/button";

import { EmptyStepsState } from "@/features/projects/components/empty-steps-state";
import { ProjectsAccordion } from "@/features/projects/components/projects-accordion";
import {
  getCachedProjects,
  projectsQueryOptions,
} from "@/features/projects/lib/queries";

interface StepsPageProps {
  query: ProjectsQuery | undefined;
}

export function StepsPage({ query }: StepsPageProps) {
  const queryClient = useQueryClient();
  const cachedProjects =
    query === undefined ? undefined : getCachedProjects(queryClient, query);

  const {
    data: fetchedProjects,
    isError,
    isLoading,
  } = useQuery({
    ...projectsQueryOptions(
      query ?? {
        birthDate: "",
        cpf: "",
      }
    ),
    enabled: query !== undefined && cachedProjects === undefined,
  });

  const projects = cachedProjects ?? fetchedProjects;

  if (query === undefined) {
    return <EmptyStepsState />;
  }

  if (cachedProjects === undefined && isLoading) {
    return (
      <div className="mx-auto mb-12 w-full max-w-lg">
        <h1 className="text-primary-foreground mb-4 text-center text-4xl font-extrabold">
          Consultando seus projetos...
        </h1>
      </div>
    );
  }

  if (isError || !projects) {
    return (
      <>
        <div className="mx-auto mb-12 w-full max-w-lg">
          <h1 className="text-primary-foreground mb-4 text-center text-4xl font-extrabold">
            Não foi possível consultar
          </h1>
          <p className="text-primary-foreground/85 mx-auto text-center text-lg">
            Verifique se o CPF e a data de nascimento estão corretos e tente
            novamente.
          </p>
        </div>

        <Alert className="bg-destructive text-background border-destructive mb-8">
          <IconAlertCircleFilled />
          <AlertTitle className="text-background">
            Ops! Algo deu errado.
          </AlertTitle>
          <AlertDescription className="text-background">
            Não encontramos projetos com os dados informados.
          </AlertDescription>
        </Alert>

        <Button
          className="h-12 w-full text-base font-bold"
          variant="outline"
          render={<Link to="/">Nova consulta</Link>}
        />
      </>
    );
  }

  const projectList = Object.entries(projects)
    .toSorted(
      ([firstProjectId], [secondProjectId]) =>
        Number(firstProjectId) - Number(secondProjectId)
    )
    .map(([, project]) => project);

  if (projectList.length === 0) {
    return <EmptyStepsState />;
  }

  return (
    <>
      <div className="mx-auto mb-12 w-full max-w-lg">
        <h1 className="text-primary-foreground mb-4 text-center text-2xl font-extrabold text-pretty md:text-4xl">
          Andamento de seus projetos
        </h1>
        <p className="text-primary-foreground/85 mx-auto text-center text-sm md:text-lg">
          Acompanhe as principais etapas dos seus projetos com a TOPSUN!
        </p>
      </div>

      <ProjectsAccordion projects={projectList} />

      <Button
        className="mb-2 h-12 w-full text-base font-bold"
        variant="default"
        render={
          <Link to="/">
            <IconPlusFilled />
            Nova consulta
          </Link>
        }
      />
      <Button
        className="h-12 w-full text-base font-bold"
        variant="outline"
        render={
          <a
            href="https://wa.me/554730548001"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconHelpFilled />
            Dúvidas? Fale com a TOPSUN no WhatsApp!
          </a>
        }
      />
    </>
  );
}
