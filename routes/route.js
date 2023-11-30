import express from 'express';
import { loginUser, signupUser, rootRoute } from '../controller/userController.js';


const router = express.Router();

router.get('/', rootRoute);

router.post('/login', loginUser);
router.post('/signup', signupUser);

export default router;