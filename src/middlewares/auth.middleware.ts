import { Request, Response, NextFunction } from 'express';
import i18next from 'i18next';

const { t } = i18next;

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.session.user?.id;

    if (currentUserId === undefined) {
        res.status(400).json({ message: t('error.userNotFound') });
        return;
    }

    next();
};
