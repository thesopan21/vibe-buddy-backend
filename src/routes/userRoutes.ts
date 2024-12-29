import { creatNewUserController, greetingController } from '@/controllers/userController';
import { Router } from 'express';

const userRoutes = Router();

userRoutes.get('/', greetingController);
userRoutes.post('/register', creatNewUserController)

export default userRoutes;