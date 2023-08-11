import express from 'express';
import { message } from '../controllers/message.js';
import { verifyUser } from '../middlewares/verifyUser.js';
const router = express.Router();

router.get('/:selectedUserId',message);     

export default router;
