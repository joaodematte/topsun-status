import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertCircleFilled } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@topsun-status/ui/components/alert";
import { Button } from "@topsun-status/ui/components/button";
import { Card, CardContent } from "@topsun-status/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@topsun-status/ui/components/field";
import { Input } from "@topsun-status/ui/components/input";
import { useId } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  formatBirthDate,
  parseBirthDateForRequest,
} from "@/features/projects/lib/birth-date";
import { formatCpf } from "@/features/projects/lib/cpf";
import { fetchProjectsMutationOptions } from "@/features/projects/lib/queries";
import { clientFormSchema } from "@/features/projects/schemas/client-form-schema";
import type { ClientFormValues } from "@/features/projects/schemas/client-form-schema";

export function ClientForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ClientFormValues>({
    defaultValues: {
      birthDate: "",
      cpf: "",
    },
    resolver: zodResolver(clientFormSchema),
  });

  const cpfInputId = useId();
  const birthDateInputId = useId();

  const { isError, isPending, mutateAsync } = useMutation(
    fetchProjectsMutationOptions(queryClient)
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    const query = {
      birthDate: parseBirthDateForRequest(data.birthDate),
      cpf: data.cpf,
    };

    try {
      await mutateAsync(query);

      await navigate({
        search: query,
        to: "/steps",
      });
    } catch {
      // Error state is surfaced via mutation isError.
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-8 py-8 shadow-none">
        <CardContent className="px-8">
          <FieldGroup>
            <Controller
              name="cpf"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={cpfInputId}
                    className="text-base font-bold"
                  >
                    CPF
                  </FieldLabel>
                  <Input
                    {...field}
                    id={cpfInputId}
                    aria-invalid={fieldState.invalid}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    maxLength={14}
                    autoComplete="off"
                    className="focus-visible:ring-ring aria-invalid:ring-destructive dark:aria-invalid:ring-destructive h-12"
                    onChange={(event) => {
                      field.onChange(formatCpf(event.target.value));
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    O CPF será formatado automaticamente enquanto você digita.
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              name="birthDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={birthDateInputId}
                    className="text-base font-bold"
                  >
                    Data de nascimento
                  </FieldLabel>
                  <Input
                    {...field}
                    id={birthDateInputId}
                    aria-invalid={fieldState.invalid}
                    placeholder="DD/MM/YYYY"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="off"
                    className="focus-visible:ring-ring aria-invalid:ring-destructive dark:aria-invalid:ring-destructive h-12"
                    onChange={(event) => {
                      field.onChange(formatBirthDate(event.target.value));
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Use a data de nascimento do titular cadastrado no projeto.
                  </FieldDescription>
                </Field>
              )}
            />

            <Field>
              <Button
                className="h-12 text-base font-bold"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Consultando..." : "Consultar projetos"}
              </Button>
            </Field>

            {isError && (
              <Field>
                <Alert className="bg-destructive text-background border-destructive">
                  <IconAlertCircleFilled />
                  <AlertTitle className="text-background">
                    Ops! Algo deu errado.
                  </AlertTitle>
                  <AlertDescription className="text-background">
                    Verifique se o CPF e a data de nascimento estão corretos e
                    tente novamente.
                  </AlertDescription>
                </Alert>
              </Field>
            )}
          </FieldGroup>
        </CardContent>
      </Card>
    </form>
  );
}
