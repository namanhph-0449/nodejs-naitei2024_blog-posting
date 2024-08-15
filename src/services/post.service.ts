import { Not } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { PostVisibility } from '../constants/post-visibility';
import { CreatePostDto } from '../dtos/post/create-post.dto';
import { Post } from '../entities/post.entity';
import { UserService } from './user.service';

const userService = new UserService();
export class PostService {
    private postRepository = AppDataSource.getRepository(Post);

    async getPostById(postId: number) {
        return await this.postRepository.findOne({
            where: { postId },
        });
    }

    async getPostsByUserId(userId: number) {
      const pinnedPosts = await this.postRepository.find({
        where: { user: { userId }, visible: PostVisibility.PINNED },
        order: { createdAt: 'DESC' },
      });
    
      const nonPinnedPosts = await this.postRepository.find({
        where: { user: { userId }, visible: Not(PostVisibility.PINNED) },
        order: { createdAt: 'DESC' },
      });
    
      return [...pinnedPosts, ...nonPinnedPosts];
    }
    

    async getPostsForGuest(page: number = 1) {
      const pageSize = 3;
      const offset = (page - 1) * pageSize;

      const posts = await this.postRepository.find({
        where: { visible: PostVisibility.PUBLIC },
        relations: ['user'],
        order: { createdAt: 'DESC' },
        skip: offset,
        take: pageSize,
      });

      return posts;
    }

    async getPostsByVisibility(visibility: PostVisibility) {
        return await this.postRepository.find({
            where: { visible: visibility },
        });
    }

    async getFYPPosts(userId: number, page: number = 1) {
      const pageSize = 3;
      const offset = (page - 1) * pageSize;
    
      const posts = await this.postRepository.find({
        relations: ['user'],
        where: [
          { visible: PostVisibility.PUBLIC, user: { userId: Not(userId) } }, // All public posts from other users
          { user: { userId } }, // All posts from the current user
        ],
        order: { createdAt: 'DESC' }, 
        skip: offset, 
        take: pageSize, 
      });
    
      return posts;
    }   

    async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
        const user = await userService.getUserById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        
        const post = this.postRepository.create({
          ...createPostDto,
          //trust the magic (join table) hehe
          user: user,
        });
    
        return this.postRepository.save(post);
      }
    
}
