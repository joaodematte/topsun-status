import { projectsQuerySchema } from "@topsun-status/shared";
import { Hono } from "hono";

import { AppError } from "@/errors";
import { rateLimit } from "@/middleware/rate-limit";
import { getProjetosSteps } from "@/services/get-projetos-steps";

export const projectsRoute = new Hono();

projectsRoute.use("/*", rateLimit({ max: 30, windowMs: 60_000 }));

projectsRoute.get("/", async (c) => {
  const parsed = projectsQuerySchema.safeParse({
    birthDate: c.req.query("birthDate"),
    cpf: c.req.query("cpf"),
  });

  if (!parsed.success) {
    return c.json({ error: "Invalid CPF or birthDate format" }, 400);
  }

  try {
    const projectsById = await getProjetosSteps(
      parsed.data.cpf,
      parsed.data.birthDate
    );

    return c.json(projectsById);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message }, 404);
    }

    throw error;
  }
});
