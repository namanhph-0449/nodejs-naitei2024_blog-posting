import { Router } from 'express';

import loginRouter from './login.route';
import postRouter from './post.route';

const router: Router = Router();

router.use('/login', loginRouter);
router.use('/posts', postRouter);

export default router;
