import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { listMyEvents, createEvent, updateEvent, deleteEvent, listSwappableFromOthers } from '../controllers/eventController.js';

const router = Router();

router.use(authRequired);

router.get('/', listMyEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

// Swappable marketplace
router.get('/market/swappable', listSwappableFromOthers);

export default router;


