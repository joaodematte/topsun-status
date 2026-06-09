import { Link } from "@tanstack/react-router";
import { Button } from "@topsun-status/ui/components/button";

export function EmptyStepsState() {
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
