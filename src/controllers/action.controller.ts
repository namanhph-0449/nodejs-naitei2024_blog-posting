import { Request, Response } from 'express';
import { ActionService } from '../services/action.service';
import asyncHandler from 'express-async-handler';
import i18next from 'i18next';

const { t } = i18next;
const actionService = new ActionService();

export const postLike = asyncHandler(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const userId = req.session.user?.id;
  if (!postId || !userId) {
    res.status(400).json({ success: false, message: t('error.missingParams') });
    return;
  }
  try {
    await actionService.likePost(postId, userId);
    res.status(200).json({ success: true, message: t('success.like') });
  } catch (error) {
    res.status(500).json({ success: false, message: t('error.default') });
  }
  return;
});

export const postBookmark = asyncHandler(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const userId = req.session.user?.id;
  if (!postId || !userId) {
    res.status(400).json({ success: false, message: t('error.missingParams') });
    return;
  }
  try {
    await actionService.bookmarkPost(postId, userId);
    res.status(200).json({ success: true, message: t('success.bookmark') });
  } catch (error) {
    res.status(500).json({ success: false, message: t('error.default') });
  }
  return;
});
