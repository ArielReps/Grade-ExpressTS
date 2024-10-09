"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GradeSchema = new mongoose_1.Schema({
    points: { type: Number, required: true },
    comment: { type: String, required: true },
});
const Grade = (0, mongoose_1.model)('Grade', GradeSchema);
exports.default = Grade;
//# sourceMappingURL=gradeModel.js.map