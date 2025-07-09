"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.use(auth_1.authVerify);
router
    .route("/get-all-user")
    .get((0, auth_1.authorize)(["ADMIN", "SUB_ADMIN"]), userController_1.getAllUser);
router
    .route("/get-profile-by-id/:id")
    .get((0, auth_1.authorize)(["ADMIN", "SUB_ADMIN"]), userController_1.getProfileById);
router
    .route("/create-user")
    .post((0, auth_1.authorize)(["ADMIN", "SUB_ADMIN"]), userController_1.createUser);
router.route("/get-profile").get(userController_1.getProfile);
router
    .route("/update-profile/:id")
    .put((0, auth_1.authorize)(["ADMIN", "SUB_ADMIN"]), userController_1.updateProfile);
router
    .route("/delete-user/:id")
    .put((0, auth_1.authorize)(["ADMIN", "SUB_ADMIN"]), userController_1.deleteUser);
router
    .route("/get-all-audits")
    .get((0, auth_1.authorize)(["ADMIN", "SUB_ADMIN"]), userController_1.getAllAudits);
exports.default = router;
