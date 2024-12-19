import { Router } from 'express';
import { greetingController } from 'src/controllers/userController';
// import { greetingController } from 'src/controllers/userController';

const router = Router();

const userRoutes = router.get('/users', greetingController);

export default userRoutes;