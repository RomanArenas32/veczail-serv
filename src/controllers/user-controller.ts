import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  role: string;
}

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, usuario, nombre, apellido, area } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { usuario }] });
    if (existingUser) {
      res.status(400).json({ message: 'Email or username already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      role: 'ADMIN',
      usuario,
      nombre,
      apellido,
      area
    });

    // Save user
    await user.save();

    // Create and send JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role } as unknown as UserPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

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
  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering user', 
      error: (error as Error).message 
    });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Create and send JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role } as unknown as UserPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

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
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging in', 
      error: (error as Error).message 
    });
  }
};

// Get user profile
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assuming user ID is available from JWT middleware
    const userId = (req as Request & { user?: UserPayload }).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId).select('-password');
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
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: (error as Error).message 
    });
  }
};