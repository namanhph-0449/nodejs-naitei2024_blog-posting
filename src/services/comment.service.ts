import { AppDataSource } from '../config/data-source';
import { Comment } from '../entities/comment.entity';
import { PostService } from './post.service';
import { UserService } from './user.service';

const userService = new UserService();
const postService = new PostService();
  

export class CommentService {
  private commentRepository = AppDataSource.getRepository(Comment);

  private async isExistComment(commentId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { commentId } });

    if (!comment) {
      throw new Error('Comment not found');
    }
  }

  async createComment(
    commentData: Partial<Comment>,
    userId: number,
    postId: number,
    parentCommentId: number | null
  ): Promise<Comment> {
    const user = await userService.getUserById(userId);
    const post = await postService.getPostById(userId, postId);

    if (!post) {
      throw new Error('Post not found');
    }

    if (!user) {
      throw new Error('User not found');
    }

    if (parentCommentId !== null) {
      const parent = await this.commentRepository.findOne({ where: { commentId: 6 } })

      if (parent !== null) {
        const comment = this.commentRepository.create({
          ...commentData,
          user,
          post,
          parent,
        });

        return await this.commentRepository.save(comment);
      }
    }
    
    const comment = this.commentRepository.create({
      ...commentData,
      user,
      post,
    });

    return await this.commentRepository.save(comment);
  }

  async getCommentsByPost(userId: number | undefined, postId: number): Promise<Comment[]> {

    const post = await postService.getPostById(userId, postId);

    if (!post) {
      throw new Error('Post not found');
    }

    return await this.commentRepository.find({
      where: { post: { postId } },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteComment(commentId: number): Promise<void> {
    await this.isExistComment(commentId);

    await this.commentRepository.delete(commentId);
  }

  async getCommentById(commentId: number): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { commentId },
        relations: ['user', 'post'],
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      return comment;
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     } catch (error) {
        throw new Error('Comment not found');
     }
  }
}
