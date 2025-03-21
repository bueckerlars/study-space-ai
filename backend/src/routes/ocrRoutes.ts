import { Router } from 'express';
import ocrController from '../controllers/OcrController';

const router = Router();

router.post('/:source_id', (req, res) => ocrController.processOcr(req, res));

export default router;
