import { greetingController } from '@/controllers/userController';
import { Router } from 'express';

const router = Router();

const userRoutes = router.get('/users', greetingController);

export default userRoutes;