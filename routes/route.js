import express from 'express';

import { loginUser, signupUser, rootRoute, authenticateToken, premiumUser } from '../controller/userController.js';
import { serverHealth } from '../controller/healthController.js';
import { createWeeklist, getWeeklist, deleteWeeklist, checkDeadlineForTask, updateTask, deleteTask, checkDeadlineForWeeklist, markUnmarkTask, getAllActiveWeeklist, getAllWeeklistsOfUser, getUserActiveWeeklistWithTime, markUnmarkWeeklist } from '../controller/weeklistController.js';


const router = express.Router();


router.get('/', rootRoute);
router.get('/health', serverHealth);

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/premium', authenticateToken, premiumUser);

router.post('/create', authenticateToken, createWeeklist);
router.put('/updateTask', authenticateToken, checkDeadlineForTask, updateTask);
router.delete('/deleteTask', authenticateToken, checkDeadlineForTask, deleteTask);
router.post('/markUnmarkTask', authenticateToken, checkDeadlineForWeeklist, markUnmarkTask);
router.get('/getActiveWeeklistWithTime', authenticateToken, getUserActiveWeeklistWithTime);

router.get('/weeklist/:id', authenticateToken, getWeeklist);
router.get('/feed', authenticateToken, getAllActiveWeeklist);
router.post('/markUnmarkWeeklist', authenticateToken, checkDeadlineForWeeklist, markUnmarkWeeklist);
router.get('/weeklists', authenticateToken, getAllWeeklistsOfUser);
router.delete('/delete/:id', authenticateToken, deleteWeeklist);

export default router;