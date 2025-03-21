import { Router } from 'express';
import sourceController from '../controllers/SourceController';

const router = Router();

/**
 * @swagger
 * /api/sources:
 *   post:
 *     summary: Create a new source
 *     tags: [Sources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Source status
 *                 example: pending
 *               source_file_id:
 *                 type: string
 *                 description: ID of the source file
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               text_file_id:
 *                 type: string
 *                 description: ID of the text file
 *                 example: 550e8400-e29b-41d4-a716-446655440001
 *               summary_file_id:
 *                 type: string
 *                 description: ID of the summary file
 *                 example: 550e8400-e29b-41d4-a716-446655440002
 *     responses:
 *       201:
 *         description: Source successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Source'
 *       500:
 *         description: Server error
 */
router.post('/', sourceController.createSource);

/**
 * @swagger
 * /api/sources:
 *   get:
 *     summary: Get all sources
 *     tags: [Sources]
 *     responses:
 *       200:
 *         description: List of all sources
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Source'
 *       500:
 *         description: Server error
 */
router.get('/', sourceController.getAllSources);

/**
 * @swagger
 * /api/sources/{source_id}:
 *   get:
 *     summary: Get a source by ID
 *     tags: [Sources]
 *     parameters:
 *       - in: path
 *         name: source_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Source ID
 *     responses:
 *       200:
 *         description: Source details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Source'
 *       404:
 *         description: Source not found
 *       500:
 *         description: Server error
 */
router.get('/:source_id', sourceController.getSourceById);

/**
 * @swagger
 * /api/sources/status/{status}:
 *   get:
 *     summary: Get sources by status
 *     tags: [Sources]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Source status (e.g., pending, processed)
 *     responses:
 *       200:
 *         description: List of sources with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Source'
 *       500:
 *         description: Server error
 */
router.get('/status/:status', sourceController.getSourcesByStatus);

/**
 * @swagger
 * /api/sources/{source_id}:
 *   put:
 *     summary: Update a source
 *     tags: [Sources]
 *     parameters:
 *       - in: path
 *         name: source_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Source ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Source status
 *               source_file_id:
 *                 type: string
 *                 description: ID of the source file
 *               text_file_id:
 *                 type: string
 *                 description: ID of the text file
 *               summary_file_id:
 *                 type: string
 *                 description: ID of the summary file
 *     responses:
 *       200:
 *         description: Source successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Source'
 *       404:
 *         description: Source not found
 *       500:
 *         description: Server error
 */
router.put('/:source_id', sourceController.updateSource);

/**
 * @swagger
 * /api/sources/{source_id}/status:
 *   patch:
 *     summary: Update a source status
 *     tags: [Sources]
 *     parameters:
 *       - in: path
 *         name: source_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Source ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status
 *                 example: processed
 *     responses:
 *       200:
 *         description: Source status successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Source'
 *       400:
 *         description: Status field is required
 *       404:
 *         description: Source not found
 *       500:
 *         description: Server error
 */
router.patch('/:source_id/status', sourceController.updateSourceStatus);

/**
 * @swagger
 * /api/sources/{source_id}:
 *   delete:
 *     summary: Delete a source
 *     tags: [Sources]
 *     parameters:
 *       - in: path
 *         name: source_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Source ID
 *     responses:
 *       200:
 *         description: Source successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Source with ID 550e8400-e29b-41d4-a716-446655440000 successfully deleted
 *       404:
 *         description: Source not found
 *       500:
 *         description: Server error
 */
router.delete('/:source_id', sourceController.deleteSource);

/**
 * @swagger
 * /api/sources/project/{projectId}:
 *   get:
 *     summary: Get sources by project ID
 *     tags: [Sources]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of sources for the specified project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Source'
 *       500:
 *         description: Server error
 */
router.get('/project/:projectId', sourceController.getSourcesByProject);

/**
 * @swagger
 * components:
 *   schemas:
 *     Source:
 *       type: object
 *       properties:
 *         source_id:
 *           type: string
 *           description: Source ID
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         status:
 *           type: string
 *           description: Status of the source
 *           example: pending
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         source_file_id:
 *           type: string
 *           description: ID of the source file
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         text_file_id:
 *           type: string
 *           description: ID of the text file
 *           example: 550e8400-e29b-41d4-a716-446655440001
 *         summary_file_id:
 *           type: string
 *           description: ID of the summary file
 *           example: 550e8400-e29b-41d4-a716-446655440002
 */

export default router;
