import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import userRoutes from './routes/userRoutes';

const app = express();

// security middleware
app.use(helmet());
app.use(cors());

app.use(express.json());

// routes
app.use('/api/v1', userRoutes);

export default app;