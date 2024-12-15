import morgan from 'morgan';
import { Application } from 'express';

export const setupLogging = (app: Application) => {
  app.use(morgan('combined'));
};