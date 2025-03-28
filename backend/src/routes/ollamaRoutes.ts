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

/**
 * @swagger
 * /api/ollama/summarize-project/{project_id}:
 *   post:
 *     tags:
 *       - Ollama
 *     summary: Erstelle eine Zusammenfassung eines gesamten Projekts
 *     description: Erzeugt eine Zusammenfassung für das gesamte Projekt, das über die project_id identifiziert wird, mithilfe der Ollama API.
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Die project_id des Projekts.
 *     responses:
 *       200:
 *         description: Projektsumfassung erfolgreich erstellt
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             data:
 *               type: object
 *               properties:
 *                 summary_project_id:
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
 * /api/ollama/chat:
 *   post:
 *     tags:
 *       - Ollama
 *     summary: Chatten mit der Ollama API
 *     description: Sendet eine Chat-Anfrage an die Ollama API und gibt die Antwort zurück.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: chat
 *         description: Ein Array von Chat-Objekten, die gesendet werden sollen.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             messages:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     description: Die Rolle des Senders (z. B. "assistant" oder "user").
 *                     example: "user"
 *                   content:
 *                     type: string
 *                     description: Der Inhalt der Nachricht.
 *                     example: "Hallo, wie kann ich dir helfen?"
 *     responses:
 *       200:
 *         description: Erfolgreiche Chat-Antwort
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     description: Die Rolle des Senders (z. B. "assistant" oder "user").
 *                   content:
 *                     type: string
 *                     description: Der Inhalt der Antwort.
 *       400:
 *         description: Ungültige Anfrage
 *       500:
 *         description: Serverfehler
 */

const router = Router();

router.post('/summarize/:source_id', ollamaController.summarize);
router.post('/generate-project-title/:project_id', ollamaController.generateProjectTitle);
router.get('/models', ollamaController.getModels);
router.post('/summarize-project/:project_id', ollamaController.summarizeProject);
router.post('/chat', ollamaController.chat);

export default router;
