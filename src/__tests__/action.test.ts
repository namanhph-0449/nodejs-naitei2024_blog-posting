import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Action } from '../entities/action.entity';
import { PostStats } from '../entities/post-stats.entity';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { ActionService } from '../services/action.service';
import { AppDataSource } from '../config/data-source';
import { PostVisibility } from '../constants/post-visibility';
import { ActionType } from '../constants/action-types';
import { CreatePostDto } from '../dtos/post/create-post.dto';

let connection: DataSource;

let postStatsRepository: Repository<PostStats>;
let postRepository: Repository<Post>;
let postService: PostService;

let actionService: ActionService;
let actionRepository: Repository<Action>;

let userRepository: Repository<User>;
let userService: UserService;

let user: User | null;
let existedUser: User | null;

let post: Post | null;
let existed_post: Post | null;

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  actionRepository = AppDataSource.getRepository(Action);
  userRepository = AppDataSource.getRepository(User);
  postRepository = AppDataSource.getRepository(Post);
  postStatsRepository = AppDataSource.getRepository(PostStats);

  userService = new UserService();
  postService = new PostService();
  actionService = new ActionService();
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
  // Sample post
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
  if (user) {
    const userActions = await actionRepository.find({ where: { user } });
    await actionRepository.remove(userActions);
    await userRepository.remove(user);
  }
  if (existedUser) {
    const existedUserActions = await actionRepository.find({ where: { user: existedUser } });
    await actionRepository.remove(existedUserActions);
    await userRepository.remove(existedUser);
  }
  await connection.destroy();
});

describe('Action Service', () => {
  it('should create a new action when viewing a post', async () => {
    const postId = post!.postId;
    const userId = user!.userId;
    await actionService.viewPost(postId, userId);
    const action = await actionService.getExistingAction(ActionType.VIEW, userId, postId);
    expect(action).not.toBeNull();
  });

  it('should update post stats when viewing a post', async () => {
    const postId = post!.postId;
    const userId = user!.userId;
    await actionService.viewPost(postId, userId);
    const postStats = await postStatsRepository.findOne({
      where: { post: { postId } },
    });
    expect(postStats!.views).toBeGreaterThan(1);
  });

  it('should like a post when calling likePost', async () => {
    const postId = post!.postId;
    const userId = user!.userId;
    await actionService.likePost(postId, userId);
    const action = await actionService.getExistingAction(ActionType.LIKE, userId, postId);
    expect(action).not.toBeNull();
  });

  it('should unlike a post when calling likePost again', async () => {
    const postId = post!.postId;
    const userId = user!.userId;
    await actionService.likePost(postId, userId);// like again
    const action = await actionService.getExistingAction(ActionType.LIKE, userId, postId);
    expect(action).toBeNull();
  });

  it('should bookmark a post when calling bookmarkPost', async () => {
    const postId = post!.postId;
    const userId = user!.userId;
    await actionService.bookmarkPost(postId, userId);
    const action = await actionService.getExistingAction(ActionType.BOOKMARK, userId, postId);
    expect(action).not.toBeNull();
  });

  it('should unbookmark a post when calling bookmarkPost again', async () => {
    const postId = post!.postId;
    const userId = user!.userId;
    await actionService.bookmarkPost(postId, userId);//bookmark again
    const action = await actionService.getExistingAction(ActionType.BOOKMARK, userId, postId);
    expect(action).toBeNull();
  });
});
