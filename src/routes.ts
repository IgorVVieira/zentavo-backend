import { authMiddleware } from '@shared/middlewares/auth';

import { AuthController } from '@users/infra/controllers/auth.controller';
import { container } from '@users/infra/di/container';

import { Router } from 'express';

import { UserController } from './users/infra/controllers/user.controller';

const router = Router();

const userController = container.resolve(UserController);
const authController = container.resolve(AuthController);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Creates a new user with the provided email, password, and name
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-01-01T00:00:00.000Z
 *       400:
 *         description: Bad request - Invalid input data
 *       409:
 *         description: Conflict - User with this email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/users', userController.create);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autenticação de usuário
 *     description: Endpoint para login de usuário e obtenção de token JWT
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthUserResponseDto'
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 *
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *       example:
 *         email: usuario@exemplo.com
 *         password: senha123
 *
 *     AuthUserResponseDto:
 *       type: object
 *       required:
 *         - user
 *         - token
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserDto'
 *         token:
 *           type: string
 *           description: Token JWT para autenticação
 *       example:
 *         user:
 *           id: "550e8400-e29b-41d4-a716-446655440000"
 *           nome: "João Silva"
 *           email: "usuario@exemplo.com"
 *           createdAt: "2024-03-31T14:30:00.000Z"
 *           updatedAt: "2024-03-31T14:30:00.000Z"
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     UserDto:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - email
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do usuário
 *         nome:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do registro
 */
router.post('/users/login', authController.login);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obter dados do usuário logado
 *     description: Endpoint para obter os dados do usuário autenticado através do token JWT
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDto'
 *       401:
 *         description: Não autorizado - Token inválido ou ausente
 *       403:
 *         description: Acesso negado
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
router.get('/users/me', authMiddleware, userController.getMe);

export { router };
