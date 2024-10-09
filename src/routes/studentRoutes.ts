import express from 'express';
import { AddGradeToStudentById, GetAllStudentsAndGrades, UpdateGradeByGradeId,GetAvarage} from '../controllers/StudentController';
import { AuthUserByToken, GetStudentsByAuth } from '../utils/auth';

const router = express.Router();
router.use(AuthUserByToken)
router.use(GetStudentsByAuth)
router.route('/:id/grades').post(AddGradeToStudentById)
router.route('/').get(GetAllStudentsAndGrades)
router.route('/Avarage').get(GetAvarage)
export default router;
