import express from 'express';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middleware/AuthMiddleware';

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', AuthMiddleware.authenticate, AuthController.me);

export default router;
