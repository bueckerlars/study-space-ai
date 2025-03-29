import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import serverConfig from '../config/serverConfig';
import databaseController from './DatabaseController';
import { logger } from '../services/logger';
import { User } from '../types';

class AuthController {
  // Cookie configuration
  private static readonly COOKIE_OPTIONS = {
    httpOnly: true,       // Prevents client-side JS from reading the cookie
    secure: serverConfig.environment === 'production', // Only send over HTTPS in production
    sameSite: 'strict' as const,  // Prevents the cookie from being sent in cross-site requests
    // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/api/auth'     // Cookie is only sent to this path
  };

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username } = req.body;
      let role = 'user'; // Default role is 'user'
      
      const users = await databaseController.findAllUsers();
      logger.debug(`Number of users: ${users.length}`);
      
      // Check if this is the first user
      if (users.length === 0) {
        role = 'admin'; // Assign 'admin' role to the first user
      }
      
      // Validate input
      if (!email || !password || !username) {
        res.status(400).json({ message: 'Email, password, and username are required' });
        return;
      }
      
      // Register user
      const { accessToken, refreshToken } = await AuthService.register(email, password, username, role);
      logger.debug(`Access token: ${accessToken}`);
      logger.debug(`Refresh token: ${refreshToken}`);
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', refreshToken, AuthController.COOKIE_OPTIONS);
      
      // Log successful registration
      logger.info(`User registered: ${email}`);
      
      // Return only the access token in the response body
      res.status(201).json({ accessToken });
    } catch (error: any) {
      logger.error(`Registration error: ${error.message}`);
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
      res.cookie('refreshToken', refreshToken, AuthController.COOKIE_OPTIONS);
      
      // Log successful login
      logger.info(`User logged in: ${email}`);
      
      // Return only the access token in the response body
      res.status(200).json({ accessToken });
    } catch (error: any) {
      logger.error(`Login error: ${error.message}`);
      res.status(401).json({ message: error.message });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    logger.debug("Refresh token request");
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken;
      logger.debug(`Refresh token: ${refreshToken}`);
      
      // Validate input
      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
      }
      
      // Generate new access token
      const result = await AuthService.refreshAccessToken(refreshToken);
      
      // Log token refresh
      logger.info(`Access token refreshed`);
      
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Token refresh error: ${error.message}`);
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
      res.clearCookie('refreshToken', AuthController.COOKIE_OPTIONS);
      
      // Log successful logout
      logger.info(`User logged out`);
      
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      logger.error(`Logout error: ${error.message}`);
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
      
      // Get the complete user data from the database using the ID
      const userData = await databaseController.findUserById(req.user.id);
      
      if (!userData) {
        res.status(404).json({ message: 'User data not found' });
        return;
      }
      
      // Log user data retrieval
      logger.info(`User data retrieved: ${userData.email}`);
      
      const userObject = {
        user_id: userData.user_id,
        email: userData.email,
        username: userData.username,
        role: userData.role,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };
      
      // Return complete user data without the password
      res.status(200).json(userObject);
    } catch (error: any) {
      logger.error(`User data retrieval error: ${error.message}`);
      res.status(401).json({ message: error.message });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { oldPassword, newPassword } = req.body;

      // Validate input
      if (!userId || !oldPassword || !newPassword) {
        res.status(400).json({ message: 'User ID, old password, and new password are required' });
        return;
      }

      // Change password
      await AuthService.changePassword(userId, oldPassword, newPassword);

      // Log successful password change
      logger.info(`Password changed successfully for user ID: ${userId}`);

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error: any) {
      logger.error(`Password change error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }
}

export default new AuthController();
