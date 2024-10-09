"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAvarage = exports.GetAllStudentsAndGrades = exports.UpdateGradeByGradeId = exports.AddGradeToStudentById = void 0;
const gradeModel_1 = __importDefault(require("../models/gradeModel"));
const AddGradeToStudentById = (req, res) => // req body: {content:{comment:string,points:number}}  req params: id:StudentId
 __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin) {
            const responseDTO = {
                success: false,
                auth: false,
                content: "You can't edit nor set grades if you aren't teacher",
                user: req.user,
            };
            res.status(400).json(responseDTO);
            return;
        }
        const currentUser = req.user;
        const ActiveStudents = req.students;
        console.log(req.body.content);
        const student = ActiveStudents.find(student => student._id.toString() == req.params.id); // Checking if student is in THE USER available approach
        if (student) {
            const grade = new gradeModel_1.default({ points: req.body.content.points, comment: req.body.content.comment });
            yield grade.save();
            student.grades.push(grade._id);
            yield student.save();
            const response = {
                user: req.user,
                success: true,
                auth: true,
                content: { message: "Grade set successfully", grade }
            };
            res.status(200).json(response);
            return;
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
        return;
    }
});
exports.AddGradeToStudentById = AddGradeToStudentById;
const UpdateGradeByGradeId = (req, res) => //req.body: {content: newGrade:{points:Number,comment:String}}}
 __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin) //If he is not teacher he can't edit
         {
            const responseDTO = {
                success: false,
                auth: false,
                content: "You can't edit nor set grades if you aren't teacher",
                user: req.user,
            };
            res.status(400).json(responseDTO);
            return;
        }
        const students = req.students;
        let finalgrade = null;
        students.forEach(student => {
            const grade = student.grades.find(grade => grade.toString() == req.params.gradeId);
            if (grade)
                finalgrade = grade;
        });
        if (finalgrade) // if he has access
         {
            const updatedDoc = yield gradeModel_1.default.findOneAndUpdate({ _id: finalgrade }, { $set: req.body.content.newGrade }, { new: true, runValidators: true }).exec();
            const responseDTO = {
                user: req.user,
                success: true,
                auth: true,
                content: updatedDoc
            };
            res.status(200).json(responseDTO);
            return;
        }
        const responseDTO = {
            user: req.user,
            success: false,
            auth: true,
            content: "Couldn't find a grade"
        };
        res.status(200).json(responseDTO);
        return;
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
});
exports.UpdateGradeByGradeId = UpdateGradeByGradeId;
const GetAllStudentsAndGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin) // if he is not admin don't give him anything, remove this block and it will give only himself
         {
            res.status(200).json({ success: false, auth: false, user: req.user, content: "You have no access if you aren't admin" });
        }
        const students = yield GetAllStudentPlusGradesByUser(req.students);
        const response = {
            content: students,
            success: true,
            auth: true,
            user: req.user
        };
        res.status(200).json(response);
        return;
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
});
exports.GetAllStudentsAndGrades = GetAllStudentsAndGrades;
const GetAvarage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield GetAllStudentPlusGradesByUser(req.students);
        const gradesAvarage = (yield students.reduce((acc, runner) => __awaiter(void 0, void 0, void 0, function* () { return (yield acc) + (yield runner.gradesAvarage()); }), Promise.resolve(0))) / students.length;
        const responseDTO = {
            content: gradesAvarage,
            success: true,
            auth: true,
            user: req.user
        };
        res.status(200).json(responseDTO);
        return;
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
});
exports.GetAvarage = GetAvarage;
function GetAllStudentPlusGradesByUser(getstudents) {
    return __awaiter(this, void 0, void 0, function* () {
        const students = getstudents;
        // Populate grades for each student manually
        yield Promise.all(students.map((student) => __awaiter(this, void 0, void 0, function* () {
            yield student.populate('grades');
        })));
        return students;
    });
}
//# sourceMappingURL=StudentController.js.map