import { PostService } from '../../services/post.service';
import { AppDataSource } from '../../config/data-source';
import { Post } from '../../entities/post.entity';
import { PostVisibility } from '../../constants/post-visibility';
import { Repository } from 'typeorm';

jest.mock('../../config/data-source');

describe('PostService', () => {
  let postService: PostService;
  let postRepository: jest.Mocked<Repository<Post>>;

  beforeEach(() => {
    postService = new PostService();
    postRepository = AppDataSource.getRepository(Post) as jest.Mocked<Repository<Post>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new post', async () => {
    const createPostDto = { title: 'New Post', content: 'Post content', visible: PostVisibility.PUBLIC };
    const userId = 1;
    const post = postService.create(createPostDto, userId);

    postRepository.save.mockResolvedValue(post);

    const result = await postService.create(createPostDto, userId);

    expect(postRepository.save).toHaveBeenCalledWith(expect.any(Post));
    expect(result).toEqual(post);
  });

  it('should get a post by ID', async () => {
    const postId = 1;
    const userId = 1;
    const mockPost = new Post({ postId, title: 'Post 1' });

    postRepository.findOne.mockResolvedValue(mockPost);

    const result = await postService.getPostById(userId, postId);

    expect(postRepository.findOne).toHaveBeenCalledWith({
      where: { postId, user: { userId } },
      relations: ['comments', 'actions', 'tags'],
    });
    expect(result).toEqual(mockPost);
  });

  it('should update a post', async () => {
    const postId = 1;
    const userId = 1;
    const updateData = { title: 'Updated Post', content: 'Updated content', visible: PostVisibility.PUBLIC };
    const mockPost = new Post({ postId, title: 'Old Title' });
    
    postRepository.findOne.mockResolvedValue(mockPost);
    postRepository.save.mockResolvedValue(mockPost);

    const result = await postService.updatePost(postId, updateData, userId);

    expect(postRepository.findOne).toHaveBeenCalledWith({
      where: { postId, user: { userId } },
    });
    expect(postRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateData));
    expect(result).toEqual(mockPost);
  });

  it('should delete a post', async () => {
    const postId = 1;
    const userId = 1;
    const mockPost = new Post({ postId, title: 'Post 1' });
    
    postRepository.findOne.mockResolvedValue(mockPost);
    postRepository.remove.mockResolvedValue(mockPost);

    await postService.deletePost(postId, userId);

    expect(postRepository.findOne).toHaveBeenCalledWith({
      where: { postId, user: { userId } },
    });
    expect(postRepository.remove).toHaveBeenCalledWith(mockPost);
  });

  it('should get posts for guest', async () => {
    const mockPosts = [new Post({ title: 'Post 1' }), new Post({ title: 'Post 2' })];
    postRepository.find.mockResolvedValue(mockPosts);

    const result = await postService.getPostsForGuest();

    expect(postRepository.find).toHaveBeenCalledWith({
      where: { visible: PostVisibility.PUBLIC },
      relations: ['tags'],
      order: { createdAt: 'DESC' },
    });
    expect(result).toEqual(mockPosts);
  });

  it('should get FYP posts', async () => {
    const userId = 1;
    const mockPosts = [new Post({ title: 'Post 1' }), new Post({ title: 'Post 2' })];
    postRepository.find.mockResolvedValue(mockPosts);

    const result = await postService.getFYPPosts(userId);

    expect(postRepository.find).toHaveBeenCalledWith({
      where: { user: { userId } },
      relations: ['tags'],
      order: { createdAt: 'DESC' },
    });
    expect(result).toEqual(mockPosts);
  });
});
