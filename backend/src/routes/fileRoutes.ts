import express from 'express';
import fileController from '../controllers/FileController';
import fileService from '../services/FileService';
import authMiddleware from '../middleware/AuthMiddleware';

const router = express.Router();
const upload = fileService.getMulterUpload();

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File management API
 */

// Apply authentication middleware to all file routes
router.use(authMiddleware.authenticate);

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a new file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload
 *       - in: formData
 *         name: user_id
 *         type: integer
 *         required: true
 *         description: ID of the user uploading the file
 *       - in: formData
 *         name: project_id
 *         type: integer
 *         required: true
 *         description: ID of the project the file belongs to
 *     responses:
 *       201:
 *         description: File successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/File'
 *       400:
 *         description: Invalid request - Missing file or required fields
 *       500:
 *         description: Server error
 */
router.post('/upload', upload.single('file'), fileController.uploadFile);

/**
 * @swagger
 * /api/files/project/{projectId}:
 *   get:
 *     summary: Get all files for a specific project
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the project to get files for
 *     responses:
 *       200:
 *         description: List of files for the project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 *       400:
 *         description: Invalid project ID
 *       500:
 *         description: Server error
 */
router.get('/project/:projectId', fileController.getFilesByProject);

/**
 * @swagger
 * /api/files/user/{userId}:
 *   get:
 *     summary: Get all files for a specific user
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to get files for
 *     responses:
 *       200:
 *         description: List of files for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', fileController.getFilesByUser);

/**
 * @swagger
 * /api/files/{id}:
 *   get:
 *     summary: Get a file by ID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the file to get
 *     responses:
 *       200:
 *         description: File details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/File'
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get('/:id', fileController.getFileById);

/**
 * @swagger
 * /api/files/{id}/content:
 *   get:
 *     summary: Get content of a file by ID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the file to get content from
 *     responses:
 *       200:
 *         description: File content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: Content of the file
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get('/:id/content', fileController.getFileContent);

/**
 * @swagger
 * /api/files/{id}/download:
 *   get:
 *     summary: Download a file by ID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the file to download
 *     responses:
 *       200:
 *         description: File download
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get('/:id/download', fileController.downloadFile);

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the file to delete
 *     responses:
 *       200:
 *         description: File successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', fileController.deleteFile);

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - file_id
 *         - user_id
 *         - project_id
 *         - name
 *         - size
 *         - type
 *         - url
 *       properties:
 *         file_id:
 *           type: string
 *           description: Unique identifier for the file
 *         user_id:
 *           type: integer
 *           description: ID of the user who uploaded the file
 *         project_id:
 *           type: integer
 *           description: ID of the project the file belongs to
 *         name:
 *           type: string
 *           description: Original name of the file
 *         size:
 *           type: integer
 *           description: File size in bytes
 *         type:
 *           type: string
 *           description: MIME type of the file
 *         url:
 *           type: string
 *           description: URL to access the file
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the file was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the file was last updated
 */

export default router;
