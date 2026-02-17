import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ name: "BookNest API", status: "ok" });
});

app.use(authRoutes);
app.use("/books", bookRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
