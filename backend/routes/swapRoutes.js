import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { createSwapRequest, respondToSwap, listRequests } from '../controllers/swapController.js';

const router = Router();

router.use(authRequired);

router.get('/requests', listRequests);
router.get('/swappable-slots', (req, res, next) => {
  // Backward compatibility for prompt path; proxy to events route
  req.url = '/events/market/swappable';
  next();
});

router.post('/swap-request', createSwapRequest);
router.post('/swap-response/:id', respondToSwap);

export default router;


