import express from 'express';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth);

router.patch('/:id', auth);

export default router;