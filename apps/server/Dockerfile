FROM oven/bun:1.3 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src
RUN bun run build

FROM oven/bun:1.3-slim AS runtime

WORKDIR /app

COPY package.json ./
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 8888

CMD ["bun", "run", "start"]
