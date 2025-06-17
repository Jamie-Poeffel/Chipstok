import { User } from "../models/User";
import jwt from 'jsonwebtoken'
import { config } from "dotenv";
config()

export function generateCharString(date: Date, length: number = 64): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsetLength = charset.length;

    // Seed basierend auf Jahr, Monat, Tag (einfach, aber deterministisch)
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

    let result = '';

    for (let i = 0; i < length; i++) {
        // Reproduzierbarer "Pseudo-Zufall" per einfacher Formel
        const index = (seed + i * 31) % charsetLength;
        result += charset[index];
    }

    return result;
}

export function generateToken(user: User) {
    jwt.sign(JSON.stringify({
        userId: user.id,
        username: user.username,
        email: user.email
    }), process.env.JWT_SECRET || "your_jwt_secret")
}