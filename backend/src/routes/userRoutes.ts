import { Router } from "express";
import { authVerify, authorize } from "../middleware/auth";
import {
  getProfile,
  updateProfile,
  getAllUser,
  createUser,
} from "../controllers/userController";

const router = Router();

router.use(authVerify);

router.get("/", authorize(["ADMIN", "SUB_ADMIN"]), getAllUser);

router.route("/create-user").post(createUser);
router.route("/get-profile").get(getProfile);
router.route("/update-profile/:id").put(updateProfile);

export default router;
