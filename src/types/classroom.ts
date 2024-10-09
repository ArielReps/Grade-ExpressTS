import { Document, ObjectId } from 'mongoose';
import { IStudent } from './student';

export interface IClassroom extends Document {
  _id: ObjectId;
  students: IStudent[];
  user_id: ObjectId;
  name: string
}