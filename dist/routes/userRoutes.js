"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../utils/auth");
const router = express_1.default.Router();
router.route('/register').post(userController_1.register);
router.route('/login').post(userController_1.login);
router.use(auth_1.AuthUserByToken);
router.use(auth_1.GetStudentsByAuth);
router.route('/').get(userController_1.getUsers);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map