import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { createSwapRequest, respondToSwap, listRequests } from '../controllers/swapController.js';

const router = Router();

router.use(authRequired);

router.get('/requests', listRequests);
router.get('/swappable-slots', async (req, res) => {
  // Direct call to controller for swappable slots
  const { listSwappableFromOthers } = await import('../controllers/eventController.js');
  return listSwappableFromOthers(req, res);
});

router.post('/swap-request', createSwapRequest);
router.post('/swap-response/:id', respondToSwap);

export default router;


