import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

router.post("/register", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || username.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters long." });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: "Please provide a valid email address." });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    try {
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUsername) {
            return res.status(400).json({ error: "Username is already taken." });
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });
        if (existingEmail) {
            return res.status(400).json({ error: "User with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "1h" });

        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            userId: newUser.id,
            token: token,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "An error occurred. Please try again later." });
    }
});




router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword, token });
});

export default router;
