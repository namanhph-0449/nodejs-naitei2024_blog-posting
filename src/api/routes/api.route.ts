import { Router } from 'express';
import commentRouter from './comment.route';

const router: Router = Router();

router.use('/comments', commentRouter);

export default router;
