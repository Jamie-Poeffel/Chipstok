import { Request, Response, RequestHandler } from "express";
import { User } from "../models/User";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { config } from 'dotenv';

config();

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            res.status(400).json({ message: "Missing credentials" });
            return;
        }

        // Try to find the user by email OR username
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: identifier }, { username: identifier }]
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '15m' }
        );

        const refresh_token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            process.env.JWT_REFRESH || 'your_jwt_secret',
            { expiresIn: '1y' }
        );


        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const success: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user
    res.json({ message: "success", username: user.username });
}
