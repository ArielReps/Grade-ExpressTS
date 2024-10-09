import { Document, ObjectId } from 'mongoose';
import { IStudent } from './student';

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  isAdmin: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>; 
}