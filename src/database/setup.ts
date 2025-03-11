import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECT as string);
        console.log("Base de datos online");
    } catch (error) {
        console.error(error);
        throw new Error('Conexión a la base de datos fallida');
    }
};