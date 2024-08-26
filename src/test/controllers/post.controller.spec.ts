import * as postController from '../../controllers/post.controller';
import { PostService } from '../../services/post.service';
import { Request, Response, NextFunction } from 'express';
import { PostVisibility } from '../../constants/post-visibility';
import { Post } from '../../entities/post.entity';

jest.mock('../../services/post.service');

describe('PostController', () => {
  let postService: jest.Mocked<PostService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    postService = new PostService() as jest.Mocked<PostService>;
    req = {
      session: {
        id: 'mockSessionId',
        cookie: {
          originalMaxAge: 0,
        },
        regenerate: jest.fn(),
        destroy: jest.fn(),
        reload: jest.fn(),
        save: jest.fn(),
        touch: jest.fn(),
        resetMaxAge: jest.fn(),
      },
      params: {},
      body: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new post', async () => {
    req.body = { title: 'New Post', content: 'Post content', visible: PostVisibility.PUBLIC };
    if (req.session && req.session.user) {
      req.session.user.id = 1;
    }
    const createdPost = new Post({ title: 'New Post' });

    postService.create.mockResolvedValue(createdPost);

    await postController.createPost[0](req as Request, res as Response, next);

    expect(postService.create).toHaveBeenCalledWith(req.body, 1);
    expect(res.json).toHaveBeenCalledWith(createdPost);
  });

  it('should get a post by ID', async () => {
    req.params = { postId: '1' };
    if (req.session && req.session.user) {
      req.session.user.id = 1;
    }
    const mockPost = new Post({ title: 'Existing Post' });

    postService.getPostById.mockResolvedValue(mockPost);

    postController.getPostById(req as Request, res as Response, next);

    expect(postService.getPostById).toHaveBeenCalledWith(1, 1);
    expect(res.json).toHaveBeenCalledWith(mockPost);
  });

  it('should update a post', async () => {
    req.params = { postId: '1' };
    req.body = { title: 'Updated Post', content: 'Updated content' };
    if (req.session && req.session.user) {
      req.session.user.id = 1;
    }
    const updatedPost = new Post({ title: 'Updated Post' });

    postService.updatePost.mockResolvedValue(updatedPost);

    postController.updatePost[0](req as Request, res as Response, next);

    expect(postService.updatePost).toHaveBeenCalledWith(1, req.body, 1);
    expect(res.json).toHaveBeenCalledWith(updatedPost);
  });

  it('should delete a post', async () => {
    req.params = { postId: '1' };
    if (req.session && req.session.user) {
      req.session.user.id = 1;
    }

    postController.deletePost[0](req as Request, res as Response, next);

    expect(postService.deletePost).toHaveBeenCalledWith(1, 1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({});
  });

  it('should handle next function for errors', async () => {
    const error = new Error('Test Error');
    postService.getPostById.mockRejectedValue(error);

    postController.getPostById(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
