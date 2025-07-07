import { Router } from "express";

import { signUp } from "../controllers/userController";
import { signIn } from "../controllers/userController";
const router = Router();

router.route("/sign-up").post(signUp);
router.route("/sign-in").get(signIn);

export default router;
