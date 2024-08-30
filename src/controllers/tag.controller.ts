import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Tag } from '../entities/tag.entity';
import { PostService } from '../services/post.service';
import { TagService } from '../services/tag.service';
import { mapTagEntitiesToTags } from '../utils';

const tagService = new TagService();
const postService = new PostService();

export const getTags = asyncHandler(async (req: Request, res: Response) => {
  const tags = await tagService.getTags(); // Tag[]
  const availableTags = mapTagEntitiesToTags(tags);
  res.json(availableTags);
});
