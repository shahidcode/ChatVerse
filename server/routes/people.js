import express from 'express';
import { people } from '../controllers/people.js';
const router = express.Router();

router.get('/',people)    // :/people/

export default router;