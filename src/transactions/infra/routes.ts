import multer from 'multer';

import { authMiddleware } from '@shared/middlewares/auth';

import { CategoryController } from '@transactions/controllers/category.controller';
import { TransactionController } from '@transactions/controllers/transaction.controller';
import { container } from '@transactions/infra/di/container';
import { Router } from 'express';

const transactionRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

const transactionController = container.resolve(TransactionController);
const categoryController = container.resolve(CategoryController);

/**
 * @swagger
 * /api/transactions/import:
 *   post:
 *     summary: Importar arquivo CSV
 *     description: Endpoint para importar dados a partir de um arquivo CSV
 *     tags:
 *       - Transações
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - statement
 *             properties:
 *               statement:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo CSV contendo os dados a serem importados
 *     responses:
 *       200:
 *         description: Arquivo importado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'File imported successfully'
 *                 data:
 *                   type: object
 *                   description: Dados processados do arquivo importado
 *       400:
 *         description: Requisição inválida ou nenhum arquivo enviado
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
transactionRouter.post(
  '/import',
  authMiddleware,
  upload.single('statement'),
  transactionController.importData.bind(transactionController),
);

transactionRouter.get(
  '/:month/:year',
  authMiddleware,
  transactionController.getTransactionsByDate.bind(transactionController),
);

transactionRouter.put(
  '/:id',
  authMiddleware,
  transactionController.update.bind(transactionController),
);

transactionRouter.post(
  '/categories',
  authMiddleware,
  categoryController.create.bind(categoryController),
);

transactionRouter.get(
  '/categories',
  authMiddleware,
  categoryController.list.bind(categoryController),
);

export { transactionRouter };
