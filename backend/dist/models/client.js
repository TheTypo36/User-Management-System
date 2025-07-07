"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// db/client.ts or wherever your Prisma client lives
const client_1 = require("@prisma/client"); // or from '@prisma/client'
const prismaClientSingleton = () => {
    return new client_1.PrismaClient();
};
const prisma = (_a = global.prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
if (process.env.NODE_ENV === "development") {
    global.prisma = prisma;
}
exports.default = prisma;
