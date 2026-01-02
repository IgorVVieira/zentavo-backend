FROM node:24.12.0-alpine3.23 AS builder

# Instalar dependências necessárias para build (OpenSSL para Prisma)
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar arquivos de dependências primeiro (melhor cache)
COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm install

# Copiar código fonte
COPY . .

RUN npm run build

FROM node:24.12.0-alpine3.23 as prod

RUN apk add --no-cache openssl

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001

WORKDIR /app

ENV HUSKY=0
ENV NODE_ENV=production

# Copiar package files e instalar apenas dependências de produção
COPY package.json ./
COPY package-lock.json ./
# --omit=dev
RUN npm ci --omit=dev && npm cache clean --force

# Copiar schema do Prisma para migrations
COPY --from=builder /app/prisma ./prisma

# Copiar build do TypeScript
COPY --from=builder /app/dist ./dist

# Mudar ownership para usuário nodejs
RUN chown -R nodejs:nodejs /app

# Usar usuário não-root
USER nodejs

EXPOSE 3000
# Health check (ajuste a rota se sua API tiver um endpoint de health)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

CMD ["npm", "run", "start:prod"]

# docker build -t zentavo-backend .
# docker start -i zentavo-backend
