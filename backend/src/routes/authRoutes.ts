import { Router } from "express";

import { register } from "../controllers/authControllers";
import { signIn, logout } from "../controllers/authControllers";
const router = Router();

router.route("/sign-up").post(register);
router.route("/sign-in").post(signIn);
router.route("/logout").get(logout);

export default router;
