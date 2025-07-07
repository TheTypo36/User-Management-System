import { Router } from "express";

import { createUser } from "../controllers/userController";
import { signIn } from "../controllers/userController";
const router = Router();

router.route("/sign-up").post(createUser);
router.route("/sign-in").get(signIn);

export default router;
