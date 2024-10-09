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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StudentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    classroom_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Classroom' },
    grades: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Grade' }],
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
StudentSchema.methods.gradesAvarage = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.populate('grades');
        if (!this.grades || this.grades.length === 0) {
            return 0;
        }
        return this.grades.reduce((acc, runner) => acc + runner.points, 0) / this.grades.length;
    });
};
StudentSchema.methods.GetGrades = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.populate('grades');
        return this.grades;
    });
};
const Student = (0, mongoose_1.model)('Student', StudentSchema);
exports.default = Student;
//# sourceMappingURL=studentModel.js.map