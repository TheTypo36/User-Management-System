"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const authControllers_2 = require("../controllers/authControllers");
const router = (0, express_1.Router)();
router.route("/sign-up").post(authControllers_1.register);
router.route("/sign-in").get(authControllers_2.signIn);
exports.default = router;
