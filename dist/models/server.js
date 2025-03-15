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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const setup_1 = require("../database/setup");
class AppServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.PORT = process.env.PORT || 8000;
        this.userPath = '/user';
        // Initialize server components
        this.connectDB();
        this.middlewares();
        this.routes();
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, setup_1.dbConnection)();
                console.log('Conexión a la base de datos establecida en el servidor');
            }
            catch (error) {
                console.error('Error al conectar a la base de datos:', error);
                throw error;
            }
        });
    }
    middlewares() {
        const corsOptions = {
            origin: ['http://localhost:3000', 'https://veczail-vecz.netlify.app'],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            optionsSuccessStatus: 200,
        };
        this.app.use((0, cors_1.default)(corsOptions));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        // Cambiado para usar import en lugar de require
        this.app.use(this.userPath, require('../routes/user'));
    }
    listen() {
        this.app.listen(this.PORT, () => {
            console.log("Servidor corriendo en el puerto:", this.PORT);
        });
    }
}
exports.default = AppServer;
