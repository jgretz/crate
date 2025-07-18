import jwt from 'jsonwebtoken';

export interface AuthContext {
  userId?: string;
  email?: string;
}

export function getAuthContext(request: Request): AuthContext {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {};
  }

  const token = authHeader.slice(7);
  
  try {
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    return {};
  }
}

export function requireAuth(context: AuthContext): string {
  if (!context.userId) {
    throw new Error('Authentication required');
  }
  return context.userId;
}