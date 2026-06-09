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
import { z } from "zod";

import { formatCpf, validateCpf } from "@/utils/cpf";
import type { ProjectsById } from "@/utils/projects";
import { PROJECTS_QUERY_KEY } from "@/utils/projects";
import { mutations } from "@/utils/query";

const BIRTH_DATE_MAX_DIGITS = 8;
const BIRTH_DATE_DAY_END = 2;
const BIRTH_DATE_MONTH_END = 4;

function getDigits(value: string, maxLength: number): string {
  let digits = "";

  for (const character of value) {
    if (character >= "0" && character <= "9") {
      digits += character;
    }

    if (digits.length === maxLength) {
      return digits;
    }
  }

  return digits;
}

function formatBirthDate(value: string): string {
  const digits = getDigits(value, BIRTH_DATE_MAX_DIGITS);
  const day = digits.slice(0, BIRTH_DATE_DAY_END);
  const month = digits.slice(BIRTH_DATE_DAY_END, BIRTH_DATE_MONTH_END);
  const year = digits.slice(BIRTH_DATE_MONTH_END);

  if (year) {
    return `${day}/${month}/${year}`;
  }

  if (month) {
    return `${day}/${month}`;
  }

  return day;
}

function parseBirthDateForRequest(value: string): string {
  const digits = getDigits(value, BIRTH_DATE_MAX_DIGITS);
  const day = digits.slice(0, BIRTH_DATE_DAY_END);
  const month = digits.slice(BIRTH_DATE_DAY_END, BIRTH_DATE_MONTH_END);
  const year = digits.slice(BIRTH_DATE_MONTH_END);

  return `${year}-${month}-${day}`;
}

const clientFormSchema = z.object({
  birthDate: z
    .string()
    .min(1, "Data de nascimento é obrigatória!")
    .refine(
      (birthDate) =>
        getDigits(birthDate, BIRTH_DATE_MAX_DIGITS).length ===
        BIRTH_DATE_MAX_DIGITS,
      {
        message: "Data de nascimento inválida",
      }
    ),
  cpf: z.string().min(1, "CPF é obrigatório!").refine(validateCpf, {
    message: "CPF inválido",
  }),
});

export function ClientForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof clientFormSchema>>({
    defaultValues: {
      birthDate: "",
      cpf: "",
    },
    resolver: zodResolver(clientFormSchema),
  });

  const cpfInputId = useId();
  const birthDateInputId = useId();

  const { mutateAsync: getProjects, isError } = useMutation({
    ...mutations.getProjects(),
    onSuccess: (projects) => {
      queryClient.setQueryData<ProjectsById>(PROJECTS_QUERY_KEY, projects);
      navigate({ to: "/steps" });
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const projects = await getProjects({
        birthDate: parseBirthDateForRequest(data.birthDate),
        cpf: data.cpf,
      });

      queryClient.setQueryData<ProjectsById>(PROJECTS_QUERY_KEY, projects);
      await navigate({ to: "/steps" });
    } catch {
      console.error("Failed to get projects");
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
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Consultando..."
                  : "Consultar projetos"}
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
