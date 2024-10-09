import { Schema, model, Document, Types } from "mongoose";
import { IGrade } from "../types/grade";
const GradeSchema: Schema = new Schema({
  points: { type: Number, required: true },
  comment: { type: String, required: true },
});

const Grade = model<IGrade>('Grade', GradeSchema);
export default Grade;