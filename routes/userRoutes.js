import express from 'express'
import {register, login} from '../controller/userController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
console.log('✅ Auth routes loaded');
export default router;