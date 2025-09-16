import { Router } from 'express';
import { requireAuth } from '../../middleware/index.js';
import { getMe } from '../../controllers/v1/user.controller.js';

const router = Router();

router.get('/me', requireAuth, getMe);

export default router;
