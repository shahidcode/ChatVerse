import express from 'express';
import { message } from '../controllers/message.js';
import { verifyUser } from '../middlewares/verifyUser.js';
const router = express.Router();

router.get('/:selectedUserId',message);     /* localhost:3000/messages/893kjadfnc  */

export default router;