import { createFileRoute } from "@tanstack/react-router";

import { ClientForm } from "@/features/projects/components/client-form";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <>
      <div className="mx-auto mb-12 w-full max-w-lg">
        <h1 className="text-primary-foreground mb-4 text-center text-4xl font-extrabold">
          Acompanhe o seu projeto
        </h1>
        <p className="text-primary-foreground/85 mx-auto text-center text-lg">
          Informe o CPF e a data de nascimento do titular para consultar o
          andamento da instalação.
        </p>
      </div>

      <ClientForm />
    </>
  );
}
