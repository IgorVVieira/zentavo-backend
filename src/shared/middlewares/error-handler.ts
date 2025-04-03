/* eslint-disable max-params */

import { CustomApplicationError } from '@shared/errors/custom-application.error';
import { InternalServerError } from '@shared/errors/internal-server-error.error';

import { NextFunction, Request, Response } from 'express';

const normalizeError = (error: Error): CustomApplicationError => {
  if (error instanceof CustomApplicationError) {
    return error;
  }

  return new InternalServerError(error);
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) {
    return next(err);
  }
  const error = normalizeError(err);
  const { statusCode } = error;
  const body = error.getBody();

  res.status(statusCode).json(body);
};
