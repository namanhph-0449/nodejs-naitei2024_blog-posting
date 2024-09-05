import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Tag } from '../entities/tag.entity';
import { PostVisibility } from '../constants/post-visibility';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { AppDataSource } from '../config/data-source';
import { CreatePostDto } from '../dtos/post/create-post.dto';

let connection: DataSource;

let postRepository: Repository<Post>;
let postService: PostService;

let userRepository: Repository<User>;
let userService: UserService;

let user: User | null;
let existedUser: User | null;

let post: Post | null;
let existed_post: Post | null;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  userRepository = AppDataSource.getRepository(User);
  postRepository = AppDataSource.getRepository(Post);
  userService = new UserService();
  postService = new PostService();
  // sample user
  await userService.createUser({
    email: 'current-email@domain',
    username: 'current_username',
    password: 'good_password',
    confirm_password: 'good_password'
  });
  user = await userService.getUserByUsername('current_username');
  // existed user
  existedUser = await userService.getUserByUsername('existed_username');
  if (!existedUser) {
    await userService.createUser({
      email: 'existed_email@domain',
      username: 'existed_username',
      password: 'good_password',
      confirm_password: 'good_password'
    });
    existedUser = await userService.getUserByUsername('existed_username');
  }
});

afterAll(async () => {
  if (user) await userRepository.remove(user);
  if (existedUser) await userRepository.remove(existedUser);
  if (post) await postRepository.remove(post);
  if (existed_post) await postRepository.remove(existed_post);
  await connection.destroy();
});

describe('Create Post', () => {
  it('should create post successfully', async () => {
    // Create post for current user
    const params: CreatePostDto = {
      title: "Sample Title",
      content: "<p>Lorem ipsum dolor sit amet</p>",
      visible: PostVisibility.PUBLIC,
      tags: []
    };
    post = await postService.create(params, user!.userId);
    expect(post!.title).toBe(params.title);
    expect(post!.content).toBe(params.content);
    expect(post!.user.userId).toBe(user!.userId);
    // Create private post for existing user
    params.visible = PostVisibility.PRIVATE;
    existed_post = await postService.create(params, existedUser!.userId);
    expect(existed_post!.title).toBe(params.title);
    expect(existed_post!.content).toBe(params.content);
    expect(existed_post!.user.userId).toBe(existedUser!.userId);
  });
});

describe('Get Post(s)', () => {
  it('should return Post Not Found error when retrieving not existed post', async () => {
    await expect(postService.getPostById(undefined, post!.postId+1))
      .rejects
      .toThrowError('Post not found');
  });

  it('should return Post Not Found error when retrieving private post', async () => {
    await expect(postService.getPostById(undefined, existed_post!.postId))
      .rejects
      .toThrowError('Post not found');
  });

  it('should return Post when retrieving existed public post', async () => {
    const getPost = await postService.getPostById(user!.userId, post!.postId);
    expect(getPost).toBeTruthy();
  });

  it('should return Posts for Guest', async () => {
    const posts = await postService.getPostsForGuest();
    expect(posts).toBeTruthy();
  });
});

describe('Update Post', () => {
  it('should update own post succesfully', async () => {
    const params: CreatePostDto = {
      title: "New Title",
      content: "<p>New content</p>",
      visible: PostVisibility.PUBLIC,
      tags: [{ name: 'unit test'}, { name: 'demo'}]
    };
    const updated_post = await postService.updatePost(post!.postId, params, user!.userId);
    expect(updated_post!.postId).toBe(post!.postId);
    expect(updated_post!.title).toBe(params.title);
    expect(updated_post!.content).toBe(params.content);
    expect(updated_post!.tags.length).toBe(2);
    expect(updated_post!.tags.some(tag => tag.name === 'unit test')).toBe(true);
  });

  it('should not update others post', async () => {
    const params: CreatePostDto = {
      title: "New Title",
      content: "<p>New content</p>",
      visible: PostVisibility.PUBLIC,
      tags: []
    };
    await expect(postService.updatePost(existed_post!.postId, params, user!.userId))
      .rejects
      .toThrowError('Post not found');
  });
});

describe('Delete Post', () => {
  it('should delete post successfully', async () => {
    // delete current user's post
    await postService.deletePost(post!.postId, user!.userId);
    await expect(postService.getPostById(user!.userId, post!.postId))
      .rejects
      .toThrowError('Post not found');
    // delete existed user's post
    await postService.deletePost(existed_post!.postId, existedUser!.userId);
    await expect(postService.getPostById(existedUser!.userId, existed_post!.postId))
      .rejects
      .toThrowError('Post not found');
  });
});
