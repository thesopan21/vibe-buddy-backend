import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import userRoutes from './routes/userRoutes';

const app = express();

// security middleware
app.use(helmet());
app.use(cors());

// routes
app.use(express.json());
app.use('/api', userRoutes);

export default app;