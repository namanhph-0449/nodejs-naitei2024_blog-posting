import { AppDataSource } from '../config/data-source';
import { Action } from '../entities/action.entity';
import { ActionType } from '../constants/action-types';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { PostStats } from '../entities/post-stats.entity';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { validateSessionRole } from '../utils/';
import { DEFAULT_VALUE } from '../constants/'

const userService = new UserService();
const postService = new PostService();

export class ActionService {
  private actionRepository = AppDataSource.getRepository(Action);
  private postStatsRepository = AppDataSource.getRepository(PostStats);

  private validateAction(type: ActionType, post: Post|null, user: User|null) {
    return (!!post && (user || type === ActionType.VIEW));
  }

  private async createAction(type: ActionType, postId: number, userId: number) {
    const action = new Action();
    const user = await userService.getUserById(userId);
    const post = await postService.getPostById(userId, postId);
    if (!this.validateAction(type, post, user)) return action;
    action.type = type;
    action.post = post;
    if (user) action.user = user;
    return action;
  }

  private async updatePostStats(postId: number, increment: boolean, type: ActionType) {
    const postStats = await this.postStatsRepository.findOne({
      where: { post: { postId } },
    });
    if (postStats) {
      if (increment) {
        if (type === ActionType.VIEW) postStats.views++;
        if (type === ActionType.LIKE) postStats.likes++;
        if (type === ActionType.COMMENT) postStats.comments++;
      } else {
        if (type === ActionType.LIKE) postStats.likes--;
        if (type === ActionType.COMMENT) postStats.comments--;
      }
      await this.postStatsRepository.save(postStats);
    }
  }

  private async getExistingAction(type: ActionType, userId: number, postId: number) {
    return await this.actionRepository.findOne({
      where: {
        type,
        user: { userId },
        post: { postId },
      },
    });
  }

  async viewPost(postId: number, userId: number | undefined) {
    const action = await this.createAction(ActionType.VIEW, postId, userId ?? DEFAULT_VALUE);
    const savedAction = await this.actionRepository.save(action);
    if (savedAction) {
      await this.updatePostStats(postId, true, ActionType.VIEW);
    }
  }

  async likePost(postId: number, userId: number) {
    const existingAction = await this.getExistingAction(ActionType.LIKE, userId, postId);
    if (existingAction) {
      // User already liked the post, unlike it
      await this.actionRepository.delete(existingAction.id);
      await this.updatePostStats(postId, false, ActionType.LIKE);
    } else {
      // User hasn't liked the post, like it
      const action = await this.createAction(ActionType.LIKE, postId, userId);
      const savedAction = await this.actionRepository.save(action);
      if (savedAction) {
        await this.updatePostStats(postId, true, ActionType.LIKE);
      }
    }
  }

  async bookmarkPost(postId: number, userId: number) {
    const existingAction = await this.getExistingAction(ActionType.BOOKMARK, userId, postId);
    if (existingAction) {
      // User already bookmarked the post, unbookmark it
      await this.actionRepository.delete(existingAction.id);
    } else {
      // User hasn't bookmarked the post, bookmark it
      const action = await this.createAction(ActionType.BOOKMARK, postId, userId);
      await this.actionRepository.save(action);
    }
  }
}
