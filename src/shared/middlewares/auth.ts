import jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '../errors/unauthorized.error';

/**
 * Middleware para autenticação via JWT
 * @param {Request} req - O objeto de requisição Express
 * @param {Response} res - O objeto de resposta Express
 * @param {NextFunction} next - A função next do Express
 * @throws {UnauthorizedError} - Erro lançado quando o token é inválido ou expirado
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Token de autenticação não fornecido');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      throw new UnauthorizedError('Formato de token inválido');
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      throw new UnauthorizedError('Formato de token inválido');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      req.userId = (decoded as jwt.JwtPayload)['id'];
    } else {
      throw new UnauthorizedError('Token inválido');
    }

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Tratar erros específicos do JWT
      if (error instanceof jwt.TokenExpiredError) {
        return next(new UnauthorizedError('Token expirado'));
      }

      return next(new UnauthorizedError('Token inválido'));
    }

    // Passar o erro para o próximo middleware de tratamento de erros
    return next(error);
  }
};
