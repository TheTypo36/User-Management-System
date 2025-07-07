import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("<h1>hello the root route</h1>");
});

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
import userRouter from "./routes/userRoutes";

app.use("/api/v1/user", userRouter);
