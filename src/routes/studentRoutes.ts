import express from 'express';
import { AddGradeToStudentById, GetAllStudentsAndGrades, UpdateGradeByGradeId,GetAvarage} from '../controllers/StudentController';
import { AuthUserByToken, GetStudentsByAuth } from '../utils/auth';

const router = express.Router();
router.use(AuthUserByToken)
router.use(GetStudentsByAuth)
router.route('/:id/AddGrade').post(AddGradeToStudentById)
router.route('/GetAllStudents').get(GetAllStudentsAndGrades)
router.route('/:gradeId/UpdateGrade').put(UpdateGradeByGradeId)
router.route('/GetAvarage').get(GetAvarage)
export default router;
