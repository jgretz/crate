import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type {LoginInput, AuthResponse, User} from '../types';
import {findUserByEmailService} from './get-users.service';

export const authService = {
  login,
  hashPassword,
};

async function login(input: LoginInput): Promise<AuthResponse | null> {
  const user = await findUserByEmailService(input.email);
  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password);
  if (!isValidPassword) {
    return null;
  }

  const jwtSecret = process.env.JWT_SECRET || 'default-secret';
  const token = jwt.sign({userId: user._id?.toString(), email: user.email}, jwtSecret, {
    expiresIn: '7d',
  });

  const {password: _, ...userWithoutPassword} = user;
  return {
    token,
    user: userWithoutPassword,
  };
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
