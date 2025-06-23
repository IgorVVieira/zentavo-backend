#!/bin/bash

echo "🛠 Aplicando migrations..."
npx prisma migrate deploy

echo "🚀 Iniciando servidor..."
npm run start
