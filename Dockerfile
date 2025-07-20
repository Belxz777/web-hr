# Используем официальный образ Node.js на основе Alpine (меньший размер)
FROM node:18-alpine AS builder

# Устанавливаем зависимости для работы с пакетами, если нужны (например, для node-gyp)
RUN apk add --no-cache libc6-compat

# Устанавливаем pnpm (если используется)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Создаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json pnpm-lock.yaml* ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение
RUN pnpm build

# Используем минимальный образ для production
FROM node:18-alpine AS runner
WORKDIR /app

# Не запускаем приложение от root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копируем необходимые файлы из builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Переключаемся на пользователя nextjs
USER nextjs

# Открываем порт
EXPOSE 3000

# Переменные окружения
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Запускаем приложение
CMD ["pnpm", "start"]