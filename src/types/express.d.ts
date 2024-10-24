// src/types/express.d.ts


import * as express from 'express';
import { UserType } from './user.type';

declare global {
  namespace Express {
    interface Request {
      user?: UserType; 
    }
  }
}
