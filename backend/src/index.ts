import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("./", (req, res) => {
  res.send("<h1>hello the root route</h1>");
});

import userRouter from "./routes/userRoutes";

app.use("./api/v1/user", userRouter);

const port = 8002;
app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
