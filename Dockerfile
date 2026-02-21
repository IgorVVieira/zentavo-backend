FROM node:24.12.0-alpine3.23 AS builder

# Necessário para Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Melhor uso de cache
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Instala todas dependências (incluindo dev)
RUN npm ci

# Gera Prisma Client
RUN npx prisma generate

# Copia restante do código
COPY . .

# Build do TypeScript
RUN npm run build

FROM node:24.12.0-alpine3.23 AS prod

RUN apk add --no-cache openssl

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

ENV NODE_ENV=production
ENV HUSKY=0

# Copiar node_modules já instalado
COPY --from=builder /app/node_modules ./node_modules

# Remover devDependencies
RUN npm prune --omit=dev

# Copiar build e prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/swagger.json ./swagger.json

# Ajustar permissões
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

# docker build -t zencash-backend .
# docker start -i zencash-backend
