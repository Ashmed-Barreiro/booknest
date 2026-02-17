import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { signToken } from "../utils/token.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed }
    });

    const token = signToken({ id: user.id, email: user.email });
    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: user.id, email: user.email });

    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
