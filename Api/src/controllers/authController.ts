import { Request, Response, RequestHandler } from "express";
import { User } from "../models/User";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
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
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const success: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email, firstname: user.firstname, lastname: user.lastname, profilePicture: user.profile.profilePicture }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '15m' });
    res.json({ message: "success", username: user.username, user: user, token: token });
}

export const MultiFactorAuth: RequestHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, code } = req.body;

        if (!email) {
            res.status(400).json({ message: "Missing email" });
            return;
        }

        if (!code) {
            const generatedCode = generateCode();
            verificationCodes.set(email, generatedCode);

            await sendEmail(email, generatedCode);

            res.status(200).json({ message: "Verification code sent to email" });
            return;
        }

        // Code provided, verify
        const isCodeValid = verifyMfaCode(email, code);

        if (!isCodeValid) {
            res.status(401).json({ message: "Invalid verification code" });
            return;
        }

        verificationCodes.delete(email);

        const user = { email };
        const token = generateAuthToken(user);

        try {
            const [updatedCount] = await User.update(
                { emailVeryfied: true },
                { where: { email } }
            );

            if (updatedCount === 0) {
                res.status(404).json({ message: "Benutzer mit dieser E-Mail nicht gefunden" });
            } else {
                res.status(200).json({
                    message: "MFA successful, E-Mail erfolgreich verifiziert",
                    token,
                });
            }
        } catch (error) {
            console.error("Fehler beim Verifizieren der E-Mail:", error);
            res.status(500).json({ message: "Interner Serverfehler", error });
        }
    } catch (error) {
        console.error("MFA error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const verificationCodes = new Map<string, string>();

const generateCode = (): string => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const sendEmail = async (email: string, code: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your MFA Verification Code",
        text: `Your verification code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
};

const verifyMfaCode = (email: string, code: string): boolean => {
    return verificationCodes.get(email) === code;
};

const generateAuthToken = (user: any): string => {
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET || "secret", {
        expiresIn: "1h",
    });
};


