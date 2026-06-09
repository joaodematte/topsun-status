import { IconHelpFilled } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@topsun-status/ui/components/button";

import { ClientForm } from "@/components/client-form";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="relative min-h-svh w-full">
      <div className="bg-primary absolute inset-0 -z-10 h-1/3 w-full overflow-hidden">
        <img
          alt="Sunny"
          className="absolute inset-0 w-5xl -translate-x-48 -translate-y-48 lg:block"
          src="/sunny.png"
        />
      </div>
      <div className="relative z-10 container mx-auto max-w-2xl px-4 py-12">
        <div className="mx-auto mb-12 w-full max-w-lg">
          <img
            alt="TOPSUN Energia"
            className="mx-auto mb-6 w-[256px]"
            src="/logo.png"
          />
          <h1 className="text-primary-foreground mb-4 text-center text-4xl font-extrabold">
            Acompanhe o seu projeto
          </h1>
          <p className="text-primary-foreground/85 mx-auto text-center text-lg">
            Informe o CPF e a data de nascimento do titular para consultar o
            andamento da instalação.
          </p>
        </div>

        <ClientForm />

        <Button className="h-12 w-full text-base font-bold" variant="outline">
          <IconHelpFilled />
          Dúvidas? Fale com a TOPSUN no WhatsApp!
        </Button>
      </div>
    </div>
  );
}
