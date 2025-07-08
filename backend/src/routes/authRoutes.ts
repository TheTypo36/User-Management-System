import { Router } from "express";

import { register } from "../controllers/userController";
import { signIn } from "../controllers/userController";
const router = Router();

router.route("/sign-up").post(register);
router.route("/sign-in").get(signIn);

export default router;
