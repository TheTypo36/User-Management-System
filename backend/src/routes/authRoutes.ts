import { Router } from "express";

import { register } from "../controllers/authControllers";
import { signIn } from "../controllers/authControllers";
const router = Router();

router.route("/sign-up").post(register);
router.route("/sign-in").get(signIn);

export default router;
