import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Comment } from '../entities/comment.entity';
import { PostVisibility } from '../constants/post-visibility';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { AppDataSource } from '../config/data-source';
import { CreatePostDto } from '../dtos/post/create-post.dto';
import { CreateCommentDto } from '../dtos/comment/create-comment-dto';

let connection: DataSource;

let postRepository: Repository<Post>;
let postService: PostService;

let userRepository: Repository<User>;
let userService: UserService;

let commentService: CommentService;

let user: User | null;
let existedUser: User | null;

let post: Post | null;
let comment: Comment | null;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  userRepository = AppDataSource.getRepository(User);
  postRepository = AppDataSource.getRepository(Post);
  userService = new UserService();
  postService = new PostService();
  commentService = new CommentService();
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
  // Create sample post
  const params: CreatePostDto = {
    title: "Sample Title",
    content: "<p>Lorem ipsum dolor sit amet</p>",
    visible: PostVisibility.PUBLIC,
    tags: []
  };
  post = await postService.create(params, existedUser!.userId);
});

afterAll(async () => {
  if (post) await postRepository.remove(post);
  if (user) await userRepository.remove(user);
  if (existedUser) await userRepository.remove(existedUser);
  await connection.destroy();
});

describe('Comment', () => {
  it('should create comment successfully', async () => {
    const params: CreateCommentDto = {
      postId: post!.postId,
      content: "Hello world",
      parentCommentId: undefined
    };
    comment = await commentService.createComment(params, user!.userId, post!.postId, null);
    expect(comment).toBeTruthy();
    expect(comment!.content).toBe(params.content);
  });

  it('should return Post Not Found error when post is invalid', async () => {
    const params: CreateCommentDto = {
      postId: post!.postId,
      content: "Hello world",
      parentCommentId: undefined
    };
    await expect(commentService.createComment(params, user!.userId, post!.postId+1, null))
      .rejects
      .toThrowError('Post not found');
  });

  it('should return User Not Found error when user is invalid', async () => {
    const params: CreateCommentDto = {
      postId: post!.postId,
      content: "Hello world",
      parentCommentId: undefined
    };
    await expect(commentService.createComment(params, user!.userId+100, post!.postId, null))
      .rejects
      .toThrowError('User not found');
  });

  it('should get a comment by its ID', async () => {
    const getComment = await commentService.getCommentById(comment!.commentId);
    expect(getComment).toBeTruthy();
  });

  it('should return Not Found error when retrieving not existed comment', async () => {
    await expect(commentService.getCommentById(comment!.commentId+1))
      .rejects
      .toThrowError('Comment not found');
  });

  it('should create reply for above comment', async () => {
    const params: CreateCommentDto = {
      postId: post!.postId,
      content: "Hello you!",
      parentCommentId: comment!.commentId
    };
    const reply = await commentService.createComment(params, existedUser!.userId, post!.postId, comment!.commentId);
    expect(reply).toBeTruthy();
    expect(reply!.content).toBe(params.content);
    expect(reply!.parent.commentId).toBe(comment!.commentId);
  });

  it('should return comments of post', async () => {
    const comments = await commentService.getCommentsByPost(undefined, post!.postId);
    expect(comment).toBeTruthy();
  });

  it('should return Post Not Found error when retrieving comment from invalid post', async () => {
    await expect(commentService.getCommentsByPost(undefined, post!.postId+1))
      .rejects
      .toThrowError('Post not found');
  });

  it('should delete comment successfully', async () => {
    await commentService.deleteComment(comment!.commentId);
    await expect(commentService.getCommentById(comment!.commentId))
      .rejects
      .toThrowError('Comment not found');
  });
});
