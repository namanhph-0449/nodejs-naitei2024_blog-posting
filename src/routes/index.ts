import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
// Import all route modules for the site here

const router: Router = Router();
const index = asyncHandler(async (req: Request, res: Response) => {
    res.render('index', {
        title: 'FC3 Blog'
    });
});

const login = asyncHandler(async (req: Request, res: Response) => {
    res.render('auth/login', {
        title: 'Login | FC3 Blog'
    });
});

router.get('/', index);
router.get('/login', login);

export default router;
