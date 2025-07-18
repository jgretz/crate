import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {InjectIn} from '@crate/iocdi';
import type {LoginInput, AuthResponse, UserRepository} from '../types';
import {USER_SYMBOLS} from './repository';

export const authService = InjectIn(
  function ({
    [USER_SYMBOLS.REPOSITORY]: userRepository,
  }: {
    [USER_SYMBOLS.REPOSITORY]: UserRepository;
  }) {
    async function login(input: LoginInput): Promise<AuthResponse | null> {
      const user = await userRepository.findByEmail(input.email);
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

    return {
      login,
      hashPassword,
    };
  },
  {callbackName: 'authService'},
);
