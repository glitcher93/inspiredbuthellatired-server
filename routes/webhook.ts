import express from 'express';
import { webhook } from '../controllers/webhookController';

const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), webhook);

export default router;