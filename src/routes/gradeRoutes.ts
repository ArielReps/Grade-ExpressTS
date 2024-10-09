import express from 'express';
import { UpdateGradeByGradeId} from '../controllers/StudentController';
import { AuthUserByToken, GetStudentsByAuth } from '../utils/auth';

const router = express.Router();
router.use(AuthUserByToken)
router.use(GetStudentsByAuth)
router.route('/:gradeId').put(UpdateGradeByGradeId)
export default router;
