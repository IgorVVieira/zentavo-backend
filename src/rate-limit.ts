import rateLimit from 'express-rate-limit';

import { HttpStatus } from '@shared/http-status.enum';

// +- 33 per second
export const limiter = rateLimit({
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      error: 'Too Many Requests',
      message: 'Você excedeu o limite de requisições.',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});
