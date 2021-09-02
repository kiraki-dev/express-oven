import { tryParse } from './utils/json-utils';
import { NextFunction, Request, Response } from 'express';

export const universalBodyParser = (req: Request, res: Response, next: NextFunction) => {
  req.body = tryParse(req.body);
  next();
}
