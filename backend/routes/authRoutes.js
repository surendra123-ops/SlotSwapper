import { Router } from 'express';
import { signup, login, me } from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authRequired, me);

export default router;


