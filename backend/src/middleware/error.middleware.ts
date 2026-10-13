import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.url}:`, err);

  res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
}
