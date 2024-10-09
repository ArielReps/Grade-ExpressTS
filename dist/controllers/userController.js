"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.register = exports.login = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentModel_1 = __importDefault(require("../models/studentModel"));
const classroomModel_1 = __importDefault(require("../models/classroomModel"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Find user by email and validate password
    const user = yield userModel_1.default.findOne({ email });
    if (!user || !(yield user.matchPassword(password))) { // Assume matchPassword is a method you created on the User model
        res.status(401).json({ message: 'Invalid email or password' });
    }
    // Create JWT token
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Set token in cookies
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        sameSite: 'none',
    });
    // Optional: Attach user info to the response
    res.status(200).json({ message: 'Login successful', user });
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, isAdmin, classroomName } = req.body;
        const newUser = new userModel_1.default({
            name,
            email,
            password,
            isAdmin,
        });
        if (!isAdmin) {
            const newStudent = new studentModel_1.default({
                name,
                user_id: newUser._id,
            });
            const ExistClassroom = yield classroomModel_1.default.findOne({ name: classroomName });
            if (!ExistClassroom) {
                res.status(400).json({ message: "Classroom name isn't exists" });
                return;
            }
            newStudent.classroom = ExistClassroom._id;
            ExistClassroom.students.push(newStudent);
            yield newStudent.save();
            yield ExistClassroom.save();
        }
        else {
            const neworupdateClassroom = yield classroomModel_1.default.findOneAndUpdate({ name: classroomName }, { $setOnInsert: { name: classroomName, user_id: newUser._id } }, // Data to insert if not found
            { upsert: true, new: true, setDefaultsOnInsert: true } // Options: upsert creates if not found
            );
            yield neworupdateClassroom.save();
        }
        yield newUser.save();
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Set token in cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            sameSite: 'none',
        });
        const responseDTO = {
            success: true,
            auth: true,
            content: { message: "User and Student added successfully" },
            user: newUser
        };
        res.status(201).json(responseDTO);
    }
    catch (error) {
        const responseDTO = {
            success: false,
            auth: false,
            content: "Error registering user",
        };
        res.status(400).json({ responseDTO, error });
    }
});
exports.register = register;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        const responseDTO = {
            success: true,
            auth: true,
            content: users,
        };
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to fetch users', error });
    }
});
exports.getUsers = getUsers;
//# sourceMappingURL=userController.js.map