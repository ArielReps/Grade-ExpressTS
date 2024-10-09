import { Request, Response } from 'express';
import User from '../models/userModel';
import { IUser } from '../types/user';
import Grade from '../models/gradeModel';
import { DTO } from '../types/DTO';
import { IStudent } from '../types/student';
import Student from "../models/studentModel"
import { IGrade } from '../types/grade';
import mongoose, { ObjectId } from 'mongoose';
export const AddGradeToStudentById = async(req:Request, res:Response):Promise<void>=>// req body: {content:{comment:string,points:number}}  req params: id:StudentId
    {
        try
        {
            if(!req.user.isAdmin)
            {
                const responseDTO:DTO={
                    success:false,
                    auth:false,
                    content:"You can't edit nor set grades if you aren't teacher",
                    user:req.user,
                }
                res.status(400).json(responseDTO)
                return; 
            }
    const currentUser:IUser = req.user;
    const ActiveStudents = req.students;
    console.log(req.body.content)
    const student = ActiveStudents.find(student=> student._id.toString() == req.params.id); // Checking if student is in THE USER available approach
    if(student)
    {
        const grade = new Grade({points:req.body.content.points,comment:req.body.content.comment})
        await grade.save();
        student.grades.push(grade._id);
        await student.save();
        const response: DTO={
            user:req.user,
            success:true,
            auth:true,
            content: {message:"Grade set successfully", grade}
        }
        res.status(200).json(response);
        return;
    }
        }catch(err)
        {
            console.log(err)
            res.status(500).json(err);
            return;
        }
}
export const UpdateGradeByGradeId = async(req:Request,res:Response):Promise<void>=>//req.body: {content: newGrade:{points:Number,comment:String}}}
{
    try{
        if(!req.user.isAdmin) //If he is not teacher he can't edit
        {
            const responseDTO:DTO={
                success:false,
                auth:false,
                content:"You can't edit nor set grades if you aren't teacher",
                user:req.user,
            }
            res.status(400).json(responseDTO)
            return;
        }
        const students:IStudent[] =req.students;
        let finalgrade: ObjectId| null = null;
        students.forEach(student => {
            const grade = student.grades.find(grade=> grade.toString() == req.params.gradeId)
            if(grade)
                finalgrade=grade;
        });
        if(finalgrade)// if he has access
        {
           const updatedDoc=await Grade.findOneAndUpdate({_id:finalgrade}, {$set: req.body.content.newGrade},{new:true,runValidators:true}).exec();
           const responseDTO:DTO ={
            user:req.user,
            success:true,
            auth:true,
            content:updatedDoc
           }
           res.status(200).json(responseDTO)
           return;
        }
        const responseDTO:DTO ={
            user:req.user,
            success:false,
            auth:true,
            content:"Couldn't find a grade"
           }
           res.status(200).json(responseDTO)
           return;
    }catch(err){
        res.status(500).json(err)
        return;
    }
}
export const GetAllStudentsAndGrades = async(req:Request,res:Response):Promise<void>=>
{
    try{
    
   const students:IStudent[] = await GetAllStudentPlusGradesByUser(req.students);
    const response:DTO={
        content: students,
        success:true,
        auth:true,
        user:req.user
    }
    res.status(200).json(response)
    return;
}catch(err){
    res.status(500).json(err)
    return;
}
}
export const GetAvarage = async(req:Request,res:Response):Promise<void>=>
{
    try{
    const students:IStudent[] =await GetAllStudentPlusGradesByUser(req.students)
    const gradesAvarage =await students.reduce(async (acc,runner) =>await acc + await runner.gradesAvarage(),Promise.resolve(0))/students.length
    const responseDTO:DTO={
        content: gradesAvarage ,
        success:true,
        auth:true,
        user:req.user
    }
    res.status(200).json(responseDTO);
    return;
}catch(err){
    res.status(500).json(err)
    return;
}
}
async function GetAllStudentPlusGradesByUser(getstudents:IStudent[]): Promise<IStudent[]>{
    const students:IStudent[] = getstudents;

    // Populate grades for each student manually
    await Promise.all(students.map(async (student) => {
        await student.populate('grades');
    }));
    return students
    
}