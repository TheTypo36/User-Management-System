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
const allowedOrigins = process.env.CLIENT_URLS?.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins?.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
