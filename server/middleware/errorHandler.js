import { z } from 'zod';

export function errorHandler(error, req, res, next) {
  if (error instanceof z.ZodError) return res.status(400).json({ message: 'Please check the submitted fields', issues: error.issues });
  console.error(error);
  res.status(500).json({ message: 'Something went wrong on the server' });
}
