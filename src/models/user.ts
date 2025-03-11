// src/models/user.ts
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
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

export default model('User', userSchema);