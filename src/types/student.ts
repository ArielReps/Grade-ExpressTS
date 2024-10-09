import { Document, ObjectId } from 'mongoose';
import { IGrade } from './grade';

export interface IStudent extends Document {
  _id: ObjectId;
  name: string;
  user_id: ObjectId;
  grades: ObjectId[];
  classroom: ObjectId;
  gradesAvarage():Promise<number>;
  GetGrades():Promise<IGrade[]>;
}