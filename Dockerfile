# Базовый образ
FROM node:18-alpine AS builder

# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем остальные файлы
COPY . .

# Собираем приложение
RUN pnpm build

# Production образ
FROM node:18-alpine
WORKDIR /app

# Устанавливаем pnpm для production
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копируем только необходимое
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
CMD ["pnpm", "start"]