import { signUp,signIn } from '../controllers/auth.js';
import { verifyUser } from '../middlewares/verifyUser.js';
import express from 'express';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin',signIn);
router.get('/verify',verifyUser);

export default router;    
