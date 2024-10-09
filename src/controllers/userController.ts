import { Request, Response } from 'express';
import User from '../models/userModel';
import jwt from "jsonwebtoken"
import {DTO} from "../types/DTO"
import Student from '../models/studentModel';
import Classroom from '../models/classroomModel';
import { error } from 'console';
export const login = async (req: Request, res: Response):Promise<void> => { //req.body = {email, password}
  const { email, password } = req.body;

  // Find user by email and validate password
  const user = await User.findOne({ email });
  

  if (!user || !(await user.matchPassword(password))) { // Assume matchPassword is a method you created on the User model
     res.status(401).json({ message: 'Invalid email or password' });
  }

  // Create JWT token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  // Set token in cookies
  res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60*24, // 24 hours
      sameSite: 'none',
  });

  // Optional: Attach user info to the response
   res.status(200).json({ message: 'Login successful', user});
};

export const register = async (req: Request, res: Response):Promise<void> => {
  try {
  const { name, email, password, isAdmin, classroomName} = req.body;

  const newUser = new User({
      name,
      email,
      password,
      isAdmin,
  });

  if(!isAdmin)
  {
    
    const newStudent = new Student({
      name,
      user_id:newUser._id,
    })
    const ExistClassroom =await Classroom.findOne({ name:classroomName });
    if(!ExistClassroom)
    {
      res.status(400).json({message:"Classroom name isn't exists"})
      return;
    }
    newStudent.classroom = ExistClassroom._id
    ExistClassroom.students.push(newStudent)
    await newStudent.save();
    await ExistClassroom.save();
  
  }
  else
  {
    const neworupdateClassroom =  await Classroom.findOneAndUpdate(
      { name:classroomName },
      { $setOnInsert: { name:classroomName, user_id: newUser._id} }, // Data to insert if not found
      { upsert: true, new: true, setDefaultsOnInsert: true } // Options: upsert creates if not found
    );
    await neworupdateClassroom.save();
  }
  await newUser.save();
      // Create JWT token
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // Set token in cookies
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60*24, // 24 hours
        sameSite: 'none',
    });  
    const responseDTO: DTO = {
      success: true,
      auth:true,
      content:{message: "User and Student added successfully"},
      user:newUser
     }
       res.status(201).json(responseDTO); 
  } catch (error) {
    const responseDTO: DTO = {
      success: false,
      auth:false,
      content:"Error registering user",
     }
       res.status(400).json({ responseDTO, error });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    const responseDTO: DTO = {
      success: true,
      auth:true,
      content:users,
     }
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch users', error });
  }
};
