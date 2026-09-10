import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "School Management System Backend is running!" });
});

// Mount auth routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});