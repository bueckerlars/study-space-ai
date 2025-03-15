import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import serverConfig from '../config/serverConfig';

class AuthController {
  // Cookie configuration
  private readonly COOKIE_OPTIONS = {
    httpOnly: true,       // Prevents client-side JS from reading the cookie
    secure: serverConfig.environment === 'production', // Only send over HTTPS in production
    sameSite: 'strict' as const,  // Prevents the cookie from being sent in cross-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/api/auth'     // Cookie is only sent to this path
  };

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      
      // Register user
      const { accessToken, refreshToken } = await AuthService.register(email, password);
      
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, this.COOKIE_OPTIONS);
      
      // Return only the access token in the response body
      res.status(201).json({ accessToken });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      
      // Login user
      const { accessToken, refreshToken } = await AuthService.login(email, password);
      
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, this.COOKIE_OPTIONS);
      
      // Return only the access token in the response body
      res.status(200).json({ accessToken });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken;
      
      // Validate input
      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
      }
      
      // Generate new access token
      const result = await AuthService.refreshAccessToken(refreshToken);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken;
      
      if (refreshToken) {
        // Invalidate the refresh token
        AuthService.invalidateRefreshToken(refreshToken);
      }
      
      // Clear the refresh token cookie
      res.clearCookie('refreshToken', this.COOKIE_OPTIONS);
      
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      // User data is attached to request by AuthMiddleware
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      
      // Return user data (without sensitive information)
      res.status(200).json({
        id: req.user.id,
        email: req.user.email
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}

export default new AuthController();
