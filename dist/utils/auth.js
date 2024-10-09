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
exports.GetStudentsByAuth = exports.AuthUserByToken = exports.generateToken = void 0;
const classroomModel_1 = __importDefault(require("../models/classroomModel"));
const studentModel_1 = __importDefault(require("../models/studentModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.generateToken = generateToken;
const AuthUserByToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token; // Get token from cookie
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = yield userModel_1.default.findById(decoded._id); // Attach user information to request object
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});
exports.AuthUserByToken = AuthUserByToken;
const GetStudentsByAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        if (!req.user.isAdmin) {
            req.students = yield studentModel_1.default.find({ user_id: userId });
            next();
            return;
        }
        const e = yield classroomModel_1.default.findOne({ user_id: userId }).populate('students');
        const students = e.students;
        students.forEach(element => {
            element.GetGrades();
        });
        req.students = students;
        next();
        return;
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports.GetStudentsByAuth = GetStudentsByAuth;
//# sourceMappingURL=auth.js.map