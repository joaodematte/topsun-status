import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { AppError } from "@/errors";
import { getProjetosSteps } from "@/services/get-projetos-steps";

const app = new Hono();

app.use("*", cors());
app.use(logger());

app.get("/health", (c) => c.json({ status: "OK" }));

app.get("/projects", async (c) => {
  const cpf = c.req.query("cpf");
  const birthDate = c.req.query("birthDate");

  if (!cpf || !birthDate) {
    return c.json({ error: "CPF and birthDate are required" }, 400);
  }

  try {
    const stepsByProjetoId = await getProjetosSteps(cpf, birthDate);

    return c.json(stepsByProjetoId);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message }, 404);
    }

    throw error;
  }
});

export default {
  fetch: app.fetch,
  hostname: process.env.HOSTNAME ?? "0.0.0.0",
  port: process.env.PORT ?? 8888,
};
