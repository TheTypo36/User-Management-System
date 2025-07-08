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
exports.signIn = exports.register = void 0;
const client_1 = __importDefault(require("../db/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;
        console.log("email ", email, " username ", username, " password ", password, " role ", role);
        if (!email || !password || !username) {
            res.status(404).json({
                message: "password, username and email are required fields for creating a user",
            });
            return;
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield client_1.default.user.create({
            data: {
                username,
                email,
                password: hashPassword,
                role,
            },
        });
        if (!user) {
            res.status(300).json({
                message: "error in creating user",
            });
            return;
        }
        res.status(200).json({ user, message: "user successfull created!!" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `internal server error in user creation ${error}` });
        console.error(error);
    }
});
exports.register = register;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            res.status(404).json({ message: "password and email is missing" });
            return;
        }
        const existingUser = yield client_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (!existingUser) {
            res.status(404).json({ message: "user doesn't existed!!" });
            return;
        }
        const match = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!match) {
            res.status(400).json({ message: "password is wrong" });
            return;
        }
        console.log("jwt secret", process.env.JWT_SECRET);
        const id = existingUser.id;
        const username = existingUser.username;
        const token = jsonwebtoken_1.default.sign({ id, username }, process.env.JWT_SCERET);
        res.status(200).json({ token, message: "user successully signed" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `internal server error in user creation ${error}` });
        console.error(error);
    }
});
exports.signIn = signIn;
