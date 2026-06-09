import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { healthRoute } from "@/routes/health";
import { projectsRoute } from "@/routes/projects";

const app = new Hono();

app.use("*", cors());
app.use(logger());

app.route("/health", healthRoute);
app.route("/projects", projectsRoute);

export default {
  fetch: app.fetch,
  hostname: process.env.HOSTNAME ?? "0.0.0.0",
  port: process.env.PORT ?? 8888,
};
