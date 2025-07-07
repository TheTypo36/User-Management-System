"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userController_2 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.route("/create-user").post(userController_1.createUser);
router.route("/sign-in").get(userController_2.signIn);
exports.default = router;
