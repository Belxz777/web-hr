# Базовый образ для сборки
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json ./

# Чистая установка production зависимостей
RUN npm ci --only=production

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение
RUN npm run build

# Финальный образ
FROM node:18-alpine
WORKDIR /app

# Копируем только необходимое из builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./.env

# Переменные окружения по умолчанию
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]