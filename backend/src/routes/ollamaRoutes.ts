import { Router } from 'express';
import ollamaController from '../controllers/OllamaController';

/**
 * @swagger
 * /summarize:
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

const router = Router();

router.post('/summarize/:source_id', ollamaController.summarize);

export default router;
