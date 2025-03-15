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
exports.getUser = exports.loginUser = exports.registerUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Register a new user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, usuario, nombre, apellido, area } = req.body;
        // Check if user already exists
        const existingUser = yield user_1.default.findOne({ $or: [{ email }, { usuario }] });
        if (existingUser) {
            res.status(400).json({ message: 'Email or username already exists' });
            return;
        }
        // Hash password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // Create new user
        const user = new user_1.default({
            email,
            password: hashedPassword,
            role: 'ADMIN',
            usuario,
            nombre,
            apellido,
            area
        });
        // Save user
        yield user.save();
        // Create and send JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                usuario: user.usuario,
                nombre: user.nombre,
                apellido: user.apellido,
                area: user.area,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
});
exports.registerUser = registerUser;
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usernameOrEmail, password } = req.body;
        // Validar que se proporcionen ambos campos
        if (!usernameOrEmail || !password) {
            res.status(400).json({ message: 'Username or email and password are required' });
            return;
        }
        // Buscar usuario por email o username
        const user = yield user_1.default.findOne({
            $or: [
                { email: usernameOrEmail },
                { usuario: usernameOrEmail }
            ]
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Verificar la contraseña
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Crear y enviar token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Respuesta exitosa
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                usuario: user.usuario,
                nombre: user.nombre,
                apellido: user.apellido,
                area: user.area,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
});
exports.loginUser = loginUser;
// Get user profile
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Assuming user ID is available from JWT middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = yield user_1.default.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            id: user._id,
            email: user.email,
            usuario: user.usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            area: user.area,
            role: user.role
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching user',
            error: error.message
        });
    }
});
exports.getUser = getUser;
