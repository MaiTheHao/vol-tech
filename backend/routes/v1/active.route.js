import { Router } from 'express';
import { getList, create, getById, join, leave } from '../../controllers/v1/active.controller.js';
import { requireAuth, requireRoles } from '../../middleware/index.js';

const router = Router();

router.get('/', getList);
router.get('/:id', getById);
router.post('/', requireAuth, requireRoles(['admin', 'editor']), create);
router.post('/:id/participants', requireAuth, join);
router.delete('/:id/participants', requireAuth, leave);

export default router;
