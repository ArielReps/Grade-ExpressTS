import Classroom from "../models/classroomModel";
import Student from "../models/studentModel";
import User from "../models/userModel"
import { IClassroom } from "../types/classroom";
import { IStudent } from "../types/student";
import { IUser } from "../types/user";
import { Request,Response,NextFunction } from "express";
import jwt, {JwtPayload} from 'jsonwebtoken';
export const generateToken = (user: IUser) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};


export const AuthUserByToken =async (req: Request, res: Response, next: NextFunction): Promise<void>=> {
    const token = req.cookies.token; // Get token from cookie

    if (!token) {
     res.status(401).json({ message: 'Not authorized, no token' });
     return;
    }

    try {
        // Verify token
        const decoded:any = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = await User.findById(decoded._id); // Attach user information to request object
        next();
    } catch (error) {
         res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
export const GetStudentsByAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user._id; 

        if (!req.user.isAdmin) { 
            req.students = await Student.find({ user_id: userId }); 
            next();
            return;
        }

        const e: IClassroom = await Classroom.findOne({ user_id: userId }).populate('students');

        const students = e.students as IStudent[];
        students.forEach(element => {
            element.GetGrades();
        });
        req.students = students;
        next();
        return;

    } catch (error) {
        console.log(error);
        return;
    }
};