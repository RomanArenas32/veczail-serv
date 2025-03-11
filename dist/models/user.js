"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/user.ts
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['ADMIN'],
        default: 'ADMIN',
    },
    usuario: {
        type: String,
        required: true,
        unique: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        enum: ['RRHH', 'CONTABILIDAD', 'OPERACIONES', 'GERENCIA'],
        required: true,
    },
});
exports.default = (0, mongoose_1.model)('User', userSchema);
