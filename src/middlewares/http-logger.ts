import { Request, Response, NextFunction } from 'express';

const httpLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

export default httpLogger;
