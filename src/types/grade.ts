import { Document, ObjectId } from 'mongoose';

export interface IGrade extends Document {
  _id: ObjectId;
  points: number;
  comment: string;
}