import { z } from "zod";

import { isCompleteBirthDate } from "@/features/projects/lib/birth-date";
import { validateCpf } from "@/features/projects/lib/cpf";

export const clientFormSchema = z.object({
  birthDate: z
    .string()
    .min(1, "Data de nascimento é obrigatória!")
    .refine(isCompleteBirthDate, {
      message: "Data de nascimento inválida",
    }),
  cpf: z.string().min(1, "CPF é obrigatório!").refine(validateCpf, {
    message: "CPF inválido",
  }),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
