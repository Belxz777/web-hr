FROM node:18-alpine AS builder

WORKDIR /app

# 1. Копируем системные файлы
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.mjs ./

# 2. Устанавливаем зависимости
RUN npm ci

# 3. Копируем исходный код
COPY src ./src
COPY public ./public
COPY app ./app
COPY .env ./

# 4. Собираем приложение
RUN npm run build

# Production образ
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]