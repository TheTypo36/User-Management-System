"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authVerify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var sortWays;
(function (sortWays) {
    sortWays[sortWays["desc"] = 0] = "desc";
    sortWays[sortWays["Asc"] = 1] = "Asc";
})(sortWays || (sortWays = {}));
const authVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token) {
        res.status(400).json({
            message: "unauthorized user",
        });
        return;
    }
    if (!process.env.JWT_SECRET) {
        return;
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decodedToken === "string") {
            return;
        }
        const user = yield (prisma === null || prisma === void 0 ? void 0 : prisma.user.findUnique({
            where: {
                id: decodedToken.userId,
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                isDeleted: true,
            },
        }));
        if (!user) {
            res.status(400).json({ message: "error in authorization" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({ message: `internal server error ${error}` });
    }
});
exports.authVerify = authVerify;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res
                .status(401)
                .json({ message: "Access denied. User not authenticated." });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res
                .status(403)
                .json({ message: "Access denied. Insufficient permissions." });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
