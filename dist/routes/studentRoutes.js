"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StudentController_1 = require("../controllers/StudentController");
const auth_1 = require("../utils/auth");
const router = express_1.default.Router();
router.use(auth_1.AuthUserByToken);
router.use(auth_1.GetStudentsByAuth);
router.route('/:id/AddGrade').post(StudentController_1.AddGradeToStudentById);
router.route('/GetAllStudents').get(StudentController_1.GetAllStudentsAndGrades);
router.route('/:gradeId/UpdateGrade').put(StudentController_1.UpdateGradeByGradeId);
router.route('/GetAvarage').get(StudentController_1.GetAvarage);
exports.default = router;
//# sourceMappingURL=studentRoutes.js.map