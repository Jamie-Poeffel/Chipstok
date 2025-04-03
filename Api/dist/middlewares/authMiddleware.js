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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const User_1 = require("../models/User");
(0, dotenv_1.config)();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies['auth_token'];
    const refreshToken = req.cookies['refresh_token'];
    try {
        if (!accessToken && !refreshToken) {
            return res.status(401).json({ message: 'No tokens provided' });
        }
        if (accessToken) {
            const decodedAccessToken = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
            const user = yield User_1.User.findByPk(decodedAccessToken.userId);
            if (!user) {
                return res.status(401).json({ message: 'User does not exist' });
            }
            req.user = user;
            return next();
        }
        if (refreshToken) {
            const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH);
            const user = yield User_1.User.findByPk(decodedRefreshToken.userId);
            if (!user) {
                return res.status(401).json({ message: 'User from refresh token does not exist' });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '15m' });
            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });
            req.user = user;
            return next();
        }
        return res.status(401).json({ message: 'Unauthorized' });
    }
    catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Invalid or expired tokens' });
    }
});
exports.authMiddleware = authMiddleware;
