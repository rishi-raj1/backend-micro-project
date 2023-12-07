import express from 'express';
import { loginUser, signupUser, rootRoute, authenticateToken, premiumUser } from '../controller/userController.js';
import { serverHealth } from '../controller/healthController.js';
import { createWeeklist, getAllWeeklists, getWeeklist, getActiveWeeklists, deleteWeeklist } from '../controller/weeklistController.js';


const router = express.Router();

router.get('/', rootRoute);
router.get('/health', serverHealth);

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/premium', authenticateToken, premiumUser);

router.post('/create', authenticateToken, createWeeklist);
router.get('/weeklists', authenticateToken, getAllWeeklists);
router.get('/weeklist/:id', authenticateToken, getWeeklist);
router.get('/feed', authenticateToken, getActiveWeeklists);
router.delete('/delete/:id', authenticateToken, deleteWeeklist);

export default router;