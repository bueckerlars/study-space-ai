import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import databaseController from '../controllers/DatabaseController';
import { User } from '../types';
import logger from './logger';
import serverConfig from '../config/serverConfig';

// Store for refresh tokens - keeping this in memory for now
// In a production app, you should store these in a database
const refreshTokens: Map<string, { userId: number, expiresAt: Date }> = new Map();

class AuthService {
  private readonly JWT_SECRET = serverConfig.jwtSecret;
  private readonly TOKEN_EXPIRY = '15m'; // Shorter expiry for access tokens
  private readonly REFRESH_TOKEN_SECRET = serverConfig.jwtSecret + '-refresh'; // Using jwtSecret as base
  private readonly REFRESH_TOKEN_EXPIRY = '7d'; // Longer expiry for refresh tokens

  async register(email: string, password: string, username: string, role: string): Promise<{ accessToken: string, refreshToken: string }> {
    logger.info(`Registration attempt for email: ${email}`);
    
    // Check if user already exists
    const existingUser = await databaseController.findUserByEmail(email);
    if (existingUser) {
      logger.warn(`Registration failed: User with email ${email} already exists`);
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await databaseController.createUser({
      email,
      password: hashedPassword,
      username,
      role
    });

    if (!newUser) {
      logger.error(`Failed to create user with email: ${email}`);
      throw new Error('Failed to create user');
    }

    // Generate tokens
    logger.debug(`Generating tokens for new user ID: ${newUser.user_id}`);
    const accessToken = this.generateToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser.user_id);
    
    logger.info(`User registered successfully: ${email}`);
    return { accessToken, refreshToken };
  }

  async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
    logger.info(`Login attempt for email: ${email}`);
    
    // Find user
    const user = await databaseController.findUserByEmail(email);
    if (!user) {
      logger.warn(`Login failed: User with email ${email} not found`);
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for email ${email}`);
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    logger.debug(`Generating tokens for user ID: ${user.user_id}`);
    const accessToken = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user.user_id);
    
    logger.info(`User logged in successfully: ${email}`);
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(token: string): Promise<{ accessToken: string }> {
    try {
      logger.debug('Attempting to refresh access token');
      
      // Verify the refresh token
      const tokenData = refreshTokens.get(token);
      if (!tokenData) {
        logger.warn('Token refresh failed: Invalid refresh token');
        throw new Error('Invalid refresh token');
      }

      // Check if token is expired
      if (new Date() > tokenData.expiresAt) {
        logger.warn(`Token refresh failed: Expired refresh token for user ID: ${tokenData.userId}`);
        refreshTokens.delete(token);
        throw new Error('Refresh token expired');
      }

      // Find the user
      const user = await databaseController.findUserById(tokenData.userId);
      if (!user) {
        logger.error(`Token refresh failed: User ID ${tokenData.userId} not found`);
        throw new Error('User not found');
      }

      // Generate new access token
      logger.debug(`Generating new access token for user ID: ${user.user_id}`);
      const accessToken = this.generateToken(user);
      
      logger.info(`Access token refreshed successfully for user ID: ${user.user_id}`);
      return { accessToken };
    } catch (error) {
      logger.error(`Error refreshing access token: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Invalid refresh token');
    }
  }

  invalidateRefreshToken(token: string): void {
    logger.debug('Invalidating refresh token');
    refreshTokens.delete(token);
    logger.info('Refresh token invalidated successfully');
  }

  getUserFromToken(token: string): any {
    try {
      logger.debug('Decoding user from token');
      const decoded = jwt.verify(token, this.JWT_SECRET);
      logger.debug(`Token decoded successfully for user ID: ${(decoded as any).id}`);
      return decoded;
    } catch (error) {
      logger.error(`Error decoding token: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Invalid token');
    }
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    logger.info(`Password change attempt for user ID: ${userId}`);

    // Find user
    const user = await databaseController.findUserById(userId);
    if (!user) {
      logger.warn(`Password change failed: User ID ${userId} not found`);
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      logger.warn(`Password change failed: Invalid old password for user ID ${userId}`);
      throw new Error('Invalid old password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await databaseController.updateUserPassword(userId, hashedPassword);

    logger.info(`Password changed successfully for user ID: ${userId}`);
  }

  private generateToken(user: User): string {
    // Create payload without sensitive data
    const payload = {
      id: user.user_id,
      email: user.email
    };

    // Generate and return token
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.TOKEN_EXPIRY });
  }

  private generateRefreshToken(userId: number): string {
    // Generate a random token
    const refreshToken = jwt.sign({ type: 'refresh' }, this.REFRESH_TOKEN_SECRET, { expiresIn: this.REFRESH_TOKEN_EXPIRY });
    
    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    
    // Save token to store
    refreshTokens.set(refreshToken, { 
      userId,
      expiresAt 
    });
    
    logger.debug(`Generated refresh token for user ID: ${userId}`);
    return refreshToken;
  }
}

export default new AuthService();
