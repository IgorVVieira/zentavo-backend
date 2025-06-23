#!/bin/bash

echo "📦 Rodando build..."
npm run build

echo "🛠 Aplicando migrations..."
npx prisma migrate deploy

echo "🚀 Iniciando servidor..."
npm run start
