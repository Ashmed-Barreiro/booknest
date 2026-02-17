import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

router.use(requireAuth);

// GET /books
router.get("/", async (req, res) => {
  const userId = req.user.id;

  const books = await prisma.book.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  res.json(books);
});

// GET /books/:id
router.get("/:id", async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);

  const book = await prisma.book.findFirst({ where: { id, userId } });
  if (!book) return res.status(404).json({ message: "Book not found" });

  res.json(book);
});

// POST /books
router.post("/", async (req, res) => {
  const userId = req.user.id;
  const { title, author, status, rating, notes } = req.body ?? {};

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  const safeStatus = ["pending", "reading", "done"].includes(status) ? status : "pending";
  const safeRating =
    rating === null || rating === undefined || rating === ""
      ? null
      : Number.isInteger(Number(rating))
        ? Number(rating)
        : null;

  if (safeRating !== null && (safeRating < 1 || safeRating > 5)) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const book = await prisma.book.create({
    data: {
      title,
      author,
      status: safeStatus,
      rating: safeRating,
      notes: notes || null,
      userId
    }
  });

  res.status(201).json(book);
});

// PUT /books/:id
router.put("/:id", async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const { title, author, status, rating, notes } = req.body ?? {};

  const existing = await prisma.book.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ message: "Book not found" });

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  const safeStatus = ["pending", "reading", "done"].includes(status) ? status : existing.status;
  const safeRating =
    rating === null || rating === undefined || rating === ""
      ? null
      : Number.isInteger(Number(rating))
        ? Number(rating)
        : null;

  if (safeRating !== null && (safeRating < 1 || safeRating > 5)) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const updated = await prisma.book.update({
    where: { id },
    data: {
      title,
      author,
      status: safeStatus,
      rating: safeRating,
      notes: notes || null
    }
  });

  res.json(updated);
});

// DELETE /books/:id
router.delete("/:id", async (req, res) => {
  const userId = req.user.id;
  const id = Number(req.params.id);

  const existing = await prisma.book.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ message: "Book not found" });

  await prisma.book.delete({ where: { id } });

  res.json({ message: "Deleted" });
});

export default router;
