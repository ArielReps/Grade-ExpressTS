import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user';
import { IStudent } from '../types/student';
import Student from './studentModel';

// User Schema
const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin:{
      type:Boolean,
      required:true,
    },
}, { timestamps: true });

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash the password before saving the user
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // If the password is not modified, skip hashing
    }
    const salt = await bcrypt.genSalt(Number(process.env.Salt) || 0); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
});

// Create User model
export default mongoose.model<IUser>('User', userSchema);
