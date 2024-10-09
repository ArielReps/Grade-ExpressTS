import { Schema, model, Document, Types } from "mongoose";
import { IClassroom } from "../types/classroom";

const classroomSchema: Schema = new Schema({
  name: { type: String, required: true },
  students:[{type:Schema.Types.ObjectId, ref:'Student'}],
  user_id: {type:Schema.Types.ObjectId, ref:'User'}
});

const Classroom = model<IClassroom>('Classroom', classroomSchema);
export default Classroom;