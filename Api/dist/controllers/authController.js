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
exports.success = exports.login = void 0;
const User_1 = require("../models/User");
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            res.status(400).json({ message: "Missing credentials" });
            return;
        }
        // Try to find the user by email OR username
        const user = yield User_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [{ email: identifier }, { username: identifier }]
            }
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Verify password
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.passwordHash);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '15m' });
        const refresh_token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_REFRESH || 'your_jwt_secret', { expiresIn: '1y' });
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "Login successful", user });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const success = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname, profilePicture: user.profile.profilePicture }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '15m' });
    res.json({ message: "success", username: user.username, user: user, token: token });
});
exports.success = success;
