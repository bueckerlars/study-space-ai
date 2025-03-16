import express from 'express';
import projectController from '../controllers/ProjectController';
import AuthMiddleware from '../middleware/AuthMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Projects management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - user_id
 *       properties:
 *         project_id:
 *           type: integer
 *           description: The auto-generated id of the project
 *           nullable: true
 *         user_id:
 *           type: integer
 *           description: The user ID who owns the project
 *         name:
 *           type: string
 *           description: The name of the project
 *         description:
 *           type: string
 *           description: Project description
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           nullable: true
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           nullable: true
 *       example:
 *         project_id: 1
 *         user_id: 123
 *         name: "Final Thesis"
 *         description: "My bachelor thesis on machine learning"
 *         created_at: "2023-01-01T00:00:00.000Z"
 *         updated_at: "2023-01-10T00:00:00.000Z"
 *   
 *     File:
 *       type: object
 *       properties:
 *         file_id:
 *           type: string
 *           description: The file UUID
 *         name:
 *           type: string
 *           description: File name
 *         project_id:
 *           type: integer
 *           description: ID of the project this file belongs to
 *         path:
 *           type: string
 *           description: File path
 *         size:
 *           type: integer
 *           description: File size in bytes
 *         type:
 *           type: string
 *           description: File MIME type
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         file_id: "550e8400-e29b-41d4-a716-446655440000"
 *         name: "presentation.pdf"
 *         project_id: 1
 *         path: "/uploads/presentation.pdf"
 *         size: 1048576
 *         type: "application/pdf"
 *         created_at: "2023-01-15T00:00:00.000Z"
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Project name
 *               description:
 *                 type: string
 *                 description: Project description
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', AuthMiddleware.authenticate, projectController.createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', AuthMiddleware.authenticate, projectController.getUserProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid project ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user does not own this project
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/:id', AuthMiddleware.authenticate, projectController.getProjectById);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Project name
 *               description:
 *                 type: string
 *                 description: Project description
 *     responses:
 *       200:
 *         description: Updated project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid project ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user does not own this project
 *       404:
 *         description: Project not found or no changes made
 *       500:
 *         description: Server error
 */
router.put('/:id', AuthMiddleware.authenticate, projectController.updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project ID
 *     responses:
 *       204:
 *         description: Project successfully deleted
 *       400:
 *         description: Invalid project ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user does not own this project
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', AuthMiddleware.authenticate, projectController.deleteProject);

/**
 * @swagger
 * /api/projects/{id}/files:
 *   get:
 *     summary: Get files associated with a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 *       400:
 *         description: Invalid project ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user does not own this project
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/:id/files', AuthMiddleware.authenticate, projectController.getProjectFiles);

export default router;
