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
router.put('/updateTask/:weeklistId', authenticateToken, checkDeadlineForTask, updateTask);
router.delete('/deleteTask/:weeklistId/:taskInd', authenticateToken, checkDeadlineForTask, deleteTask);
router.post('/markUnmarkTask', authenticateToken, checkDeadlineForWeeklist, markUnmarkTask);
router.get('/getActiveWeeklistWithTime/:userId', authenticateToken, getUserActiveWeeklistWithTime);

router.get('/weeklist/:weeklistId', authenticateToken, getWeeklist);
router.get('/feed', authenticateToken, getAllActiveWeeklist);
router.post('/markUnmarkWeeklist', authenticateToken, checkDeadlineForWeeklist, markUnmarkWeeklist);
router.get('/weeklists/:userId', authenticateToken, getAllWeeklistsOfUser);
router.delete('/delete/:weeklistId', authenticateToken, deleteWeeklist);

export default router;