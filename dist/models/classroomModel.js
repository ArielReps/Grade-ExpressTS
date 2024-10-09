"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const classroomSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    students: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Student' }],
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
const Classroom = (0, mongoose_1.model)('Classroom', classroomSchema);
exports.default = Classroom;
//# sourceMappingURL=classroomModel.js.map