import express, { Application } from 'express';
import cors from 'cors';
import { dbConnection } from '../database/setup';


class AppServer {
    app: Application;
    PORT: string | number;
    userPath: string;

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT || 8000;
        this.userPath = '/user';

        // Initialize server components
        this.connectDB();
        this.middlewares();
        this.routes();
    }

    async connectDB() {
        try {
            await dbConnection();
            console.log('Conexión a la base de datos establecida en el servidor');
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error);
            throw error;
        }
    }

    middlewares() {
        const corsOptions = {
            origin: ['http://localhost:3000', 'https://veczail-vecz.netlify.app'],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            optionsSuccessStatus: 200,
        };
        this.app.use(cors(corsOptions));
        this.app.use(express.json());
        this.app.use(express.static('public'));
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

export default AppServer;