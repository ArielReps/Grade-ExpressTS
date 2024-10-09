import { Schema, model, Document, Types } from "mongoose";
import { IStudent } from "../types/student";
import { IGrade } from "../types/grade";

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  classroom_id: {type:Schema.Types.ObjectId, ref:'Classroom'},
  grades:[{type:Schema.Types.ObjectId, ref:'Grade'}],
  user_id: {type:Schema.Types.ObjectId, ref:'User'}
});


StudentSchema.methods.gradesAvarage = async function(): Promise<number>{
await this.populate('grades');
if(!this.grades|| this.grades.length === 0){
    return 0
}
return this.grades.reduce((acc:number, runner:IGrade):number => acc+ runner.points,0)/this.grades.length;
}
StudentSchema.methods.GetGrades = async function():Promise<IGrade[]>{
    await this.populate('grades')
    return this.grades;
}
const Student = model<IStudent>('Student', StudentSchema);
export default Student;