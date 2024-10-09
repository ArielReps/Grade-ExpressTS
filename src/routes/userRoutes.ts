import express from 'express';
import { login, register, getUsers } from '../controllers/userController';
import { AuthUserByToken, GetStudentsByAuth } from '../utils/auth';

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.use(AuthUserByToken)
router.use(GetStudentsByAuth)
router.route('/').get(getUsers)
export default router;
