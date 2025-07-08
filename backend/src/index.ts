import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";

configDotenv({
  path: "./.env",
});
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.COR_ORIGIN || "http://localhost:5173", // Your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("<h1>hello the root route</h1>");
});

const port = process.env.PORT || 8083;
app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
import authControllers from "./routes/authRoutes";
import userControllers from "./routes/userRoutes";
app.use("/api/v1/auth", authControllers);

app.use("/api/v1/user", userControllers);
