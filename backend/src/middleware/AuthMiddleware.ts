import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

class AuthMiddleware {
  authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      // Get token from authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      // Extract token
      const token = authHeader.split(' ')[1];
      
      // Verify token and get user data
      const userData = AuthService.getUserFromToken(token);
      
      // Add user data to request
      req.user = userData;

      next();
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Authentication failed' });
    }
  }
}

export default new AuthMiddleware();
