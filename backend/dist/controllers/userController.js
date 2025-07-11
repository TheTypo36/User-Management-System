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
exports.getAllAudits = exports.getProfileById = exports.createUser = exports.deleteUser = exports.deactivateUser = exports.updateProfile = exports.getProfile = exports.getAllUser = void 0;
const client_1 = __importDefault(require("../db/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { limit = 10, page = 1, role = "", sortBy = "createdAt", search = "", sortOrder = "desc", } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log("skip", skip);
    try {
        const where = Object.assign(Object.assign({}, (search && {
            OR: [
                { username: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ],
        })), (role && { role: role }));
        // Role-based filtering
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "SUB_ADMIN") {
            where.role = "USER"; // Sub-admins can only see users
        }
        const [users, totalCount] = yield Promise.all([
            client_1.default.user.findMany({
                where,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    avatar: true,
                    createdAt: true,
                    isDeleted: true,
                },
                skip,
                take: parseInt(limit),
                orderBy: { [sortBy]: sortOrder },
            }),
            client_1.default.user.count({ where }),
        ]);
        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalCount,
                totalPages: Math.ceil(totalCount / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `internal server error ${error}` });
    }
});
exports.getAllUser = getAllUser;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const existingUser = yield (client_1.default === null || client_1.default === void 0 ? void 0 : client_1.default.user.findUnique({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            select: {
                username: true,
                email: true,
                avatar: true,
                createdAt: true,
                isDeleted: true,
                role: true,
            },
        }));
        if (!existingUser) {
            res.status(404).json({ message: "no user found" });
            return;
        }
        res
            .status(200)
            .json({ existingUser, message: "successfull fetch the user" });
    }
    catch (error) {
        console.log(error);
        res.json({ message: `interval server error ${error}` });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const user = req.user;
        if (!user) {
            res.json({ message: "user not defined" });
            return;
        }
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const role = req.body.role;
        const isDeleted = req.body.isDeleted;
        const id = parseInt(req.body.id) || parseInt(req.params.id);
        const avatar = req.body.avatar;
        console.log("id", id);
        const userTobeUpdate = yield (client_1.default === null || client_1.default === void 0 ? void 0 : client_1.default.user.findUnique({
            where: {
                id: id,
            },
        }));
        console.log("user who is doing", user.username, "id: ", user === null || user === void 0 ? void 0 : user.id, " user who is receving the change", userTobeUpdate === null || userTobeUpdate === void 0 ? void 0 : userTobeUpdate.username, "id: ", userTobeUpdate === null || userTobeUpdate === void 0 ? void 0 : userTobeUpdate.id);
        console.log("avatar", avatar);
        if (!userTobeUpdate) {
            res.status(404).json({ message: "user not found" });
            return;
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "SUB_ADMIN" && (userTobeUpdate === null || userTobeUpdate === void 0 ? void 0 : userTobeUpdate.role) !== "USER") {
            res.status(403).json({ message: "insufficient permission" });
            return;
        }
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "USER" && ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) !== userTobeUpdate.id) {
            res.status(403).json({ message: "insufficient permission" });
            return;
        }
        const userData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (username && { username })), (email && { email })), (avatar && { avatar })), (isDeleted !== undefined &&
            ((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) !== "USER" && { isDeleted })), (role && ((_e = req.user) === null || _e === void 0 ? void 0 : _e.role) === "ADMIN" && { role: role.toUpp }));
        if (password) {
            userData.password = yield bcrypt_1.default.hash(password, 10);
        }
        const updatedUser = yield (client_1.default === null || client_1.default === void 0 ? void 0 : client_1.default.user.update({
            where: {
                id: userTobeUpdate.id,
            },
            data: userData,
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                avatar: true,
                createdAt: true,
                updateAt: true,
                isDeleted: true,
            },
        }));
        console.log("user after updation", updatedUser);
        const auditLog = yield (client_1.default === null || client_1.default === void 0 ? void 0 : client_1.default.auditLog.create({
            data: {
                action: "Updated_User",
                performedBy: user.id,
                ipAddress: req.ip,
                target: userTobeUpdate.email,
            },
        }));
        res.status(202).json({
            updatedUser,
            auditLog,
            message: "user updated successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: `internal server ${error}` });
    }
});
exports.updateProfile = updateProfile;
const deactivateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = parseInt(req.params.id);
        const isDeleted = req.body.isDeleted;
        if (!id) {
            res.status(400).json({ message: "userid required" });
            return;
        }
        console.log("id", id);
        const existingUser = yield client_1.default.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updateAt: true,
                isDeleted: true,
                avatar: true,
            },
        });
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "SUB_ADMIN" && (existingUser === null || existingUser === void 0 ? void 0 : existingUser.role) !== "USER") {
            res.status(403).json({ message: "insufficient permission" });
            return;
        }
        yield client_1.default.user.update({
            where: {
                id,
            },
            data: {
                isDeleted: isDeleted,
            },
        });
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const audit = yield client_1.default.auditLog.create({
            data: {
                action: "Deactivate_user",
                performedBy: userId,
                target: existingUser === null || existingUser === void 0 ? void 0 : existingUser.email,
                ipAddress: req.ip,
            },
        });
        res
            .status(200)
            .json({ existingUser, audit, message: "successfull deactivated user" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `internal server error ${error}` });
    }
});
exports.deactivateUser = deactivateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            res.status(400).json({ message: "userid required" });
            return;
        }
        const existingUser = yield client_1.default.user.findUnique({
            where: {
                id,
            },
            select: {
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updateAt: true,
                isDeleted: true,
                avatar: true,
            },
        });
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "SUB_ADMIN" && (existingUser === null || existingUser === void 0 ? void 0 : existingUser.role) !== "USER") {
            res.status(403).json({ message: "insufficient permission" });
            return;
        }
        yield client_1.default.user.delete({
            where: {
                id,
            },
        });
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const audit = yield client_1.default.auditLog.create({
            data: {
                action: "Deactivate_user",
                performedBy: userId,
                target: existingUser === null || existingUser === void 0 ? void 0 : existingUser.email,
                ipAddress: req.ip,
            },
        });
        res
            .status(200)
            .json({ existingUser, audit, message: "successfull deleted user" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `internal server error ${error}` });
    }
});
exports.deleteUser = deleteUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { username, email, password, role } = req.body;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "SUB_ADMIN" && role !== "USER") {
            res.status(403).json({ message: "sufficient permission not present" });
            return;
        }
        console.log("inside create user", username, role);
        const existingUser = yield client_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            res.status(400).json({ message: "user already present with same email" });
            return;
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield client_1.default.user.create({
            data: {
                username,
                email,
                password: hashPassword,
                role,
            },
            select: {
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updateAt: true,
                isDeleted: true,
            },
        });
        if (!user) {
            res.status(500).json({ message: "User creation failed" });
            return;
        }
        console.log("created user");
        const id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const audit = yield client_1.default.auditLog.create({
            data: {
                action: "Create_User",
                performedBy: id,
                ipAddress: req.ip,
                target: user.email,
            },
        });
        res.status(202).json({ user, audit, message: "successfull created user" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `internal server error ${error}` });
    }
});
exports.createUser = createUser;
const getProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            res.status(404).json({ message: "id required" });
            return;
        }
        const existingUser = yield client_1.default.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
                role: true,
                createdAt: true,
                updateAt: true,
            },
        });
        if (!existingUser) {
            res.status(404).json({ message: "no user found with this email" });
            return;
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "user" && existingUser.id != req.user.id) {
            res.status(403).json({ message: "insuccifient permission" });
            return;
        }
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === "SUB_ADMIN" &&
            existingUser.role !== "USER" &&
            !(((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) === (existingUser === null || existingUser === void 0 ? void 0 : existingUser.id))) {
            res.status(403).json({ message: "insuccifient permission" });
            return;
        }
        res
            .status(202)
            .json({ existingUser, message: "successfull fetch the user" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `internal server error ${error}` });
    }
});
exports.getProfileById = getProfileById;
const getAllAudits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (role === "USER") {
            res.status(403).json({ message: "insufficient permission" });
            return;
        }
        const audits = yield client_1.default.auditLog.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        role: true,
                    },
                },
            },
        });
        res.status(202).json({ audits, message: "succesfully fetch all audits" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: `internal server error in fetching audits ${error}` });
    }
});
exports.getAllAudits = getAllAudits;
