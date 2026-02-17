import { verifyToken } from "../utils/token.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = header.slice("Bearer ".length);

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
