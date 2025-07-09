import { Router } from "express";
import { authVerify, authorize } from "../middleware/auth";
import {
  getProfile,
  updateProfile,
  getAllUser,
  createUser,
  deleteUser,
  getProfileById,
} from "../controllers/userController";

const router = Router();

router.use(authVerify);

router
  .route("/get-all-user")
  .get(authorize(["ADMIN", "SUB_ADMIN"]), getAllUser);

router
  .route("/get-profile-by-id/:id")
  .get(authorize(["ADMIN", "SUB_ADMIN"]), getProfileById);
router
  .route("/create-user")
  .post(authorize(["ADMIN", "SUB_ADMIN"]), createUser);
router.route("/get-profile").get(getProfile);
router
  .route("/update-profile/:id")
  .put(authorize(["ADMIN", "SUB_ADMIN"]), updateProfile);
router
  .route("/delete-user/:id")
  .put(authorize(["ADMIN", "SUB_ADMIN"]), deleteUser);

router.route("/get-all-audits").get(authorize(["ADMIN", "SUB_ADMIN"]));

export default router;
