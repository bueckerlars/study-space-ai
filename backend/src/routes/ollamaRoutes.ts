import { Router } from 'express';
import ollamaController from '../controllers/OllamaController';

/**
 * @swagger
 * /api/ollama/summarize:
 *   post:
 *     tags:
 *       - Ollama
 *     summary: Erstelle eine Zusammenfassung eines Quelltextes
 *     description: Erzeugt eine Zusammenfassung der Textdatei, die mit der angegebenen source_id verknüpft ist, mithilfe der Ollama API, speichert die Zusammenfassung in einer neuen Datei und aktualisiert den Source-Status.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: source
 *         description: Die source_id, die zusammengefasst werden soll.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             source_id:
 *               type: string
 *               example: "123456"
 *     responses:
 *       200:
 *         description: Zusammenfassung erfolgreich erstellt
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             data:
 *               type: object
 *               properties:
 *                 summary_file_id:
 *                   type: string
 *                 summary:
 *                   type: string
 *       400:
 *         description: Ungültige Anfrage
 *       500:
 *         description: Serverfehler
 */

/**
 * @swagger
 * /api/ollama/generate-project-title/{project_id}:
 *   post:
 *     tags:
 *       - Ollama
 *     summary: Erstelle einen Projekttitel
 *     description: Erzeugt einen Projekttitel für das Projekt anhand der übergebenen project_id mithilfe der Ollama API.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Die project_id des Projekts.
 *     responses:
 *       200:
 *         description: Projekttitel erfolgreich erstellt
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             data:
 *               type: object
 *               properties:
 *                 project_title:
 *                   type: string
 *       400:
 *         description: Ungültige Anfrage
 *       500:
 *         description: Serverfehler
 */

/**
 * @swagger
 * /api/ollama/models:
 *   get:
 *     tags:
 *       - Ollama
 *     summary: Gibt die verfügbaren Modelle von Ollama zurück
 *     description: Ruft die Liste der verfügbaren Modelle von der Ollama API ab.
 *     responses:
 *       200:
 *         description: Erfolgreich die Modelle abgerufen
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Serverfehler
 */

const router = Router();

router.post('/summarize/:source_id', ollamaController.summarize);
router.post('/generate-project-title/:project_id', ollamaController.generateProjectTitle);
router.get('/models', ollamaController.getModels); // new route for fetching models

export default router;
