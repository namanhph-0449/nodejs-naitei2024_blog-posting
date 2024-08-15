import { Not } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { PostVisibility } from '../constants/post-visibility';
import { CreatePostDto } from '../dtos/post/create-post.dto';
import { Post } from '../entities/post.entity';
import { UserService } from './user.service';
import { PAGE_SIZE } from '../constants/post-constant';

const userService = new UserService();
export class PostService {
    private postRepository = AppDataSource.getRepository(Post);

    async getPostById(userId: number | undefined, postId: number) {
      const post = await this.postRepository.findOne({
        where: { postId },
        relations: ['user'],
      });

      if (!post) {
        throw new Error('Post not found');
      }

      if (post.visible !== PostVisibility.PUBLIC && post.visible !== PostVisibility.PINNED) {
        if (!userId || post.user.userId !== userId) {
          throw new Error('Post not found');
        }
      }
      return post;
    }

    async getPostsByUserId(userId: number, currentUserId: number | undefined) {

      const pinnedPosts = await this.postRepository.find({
        where: { user: { userId }, visible: PostVisibility.PINNED },
        order: { createdAt: 'DESC' },
      });
    
      if (userId !== currentUserId) {
        const publicPosts = await this.postRepository.find({
          where: { user: { userId }, visible: PostVisibility.PUBLIC },
          order: { createdAt: 'DESC' },
        });

        const posts = [...pinnedPosts, ...publicPosts];
        return posts;
      }

      const remainingPosts = await this.postRepository.find({
        where: { user: { userId }, visible: Not(PostVisibility.PINNED) },
        order: { createdAt: 'DESC' },
      });
      
      const posts = [...pinnedPosts, ...remainingPosts];
      return posts;
    }
    

    async getPostsForGuest(page: number = 1) {
      const pageSize = PAGE_SIZE;
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
      const pageSize = PAGE_SIZE;
      const offset = (page - 1) * pageSize;
    
      const posts = await this.postRepository.find({
        relations: ['user'],
        where: [
           // Retrieve public or pinned posts from other users
          { user: { userId: Not(userId) }, visible: PostVisibility.PUBLIC },
          { user: { userId: Not(userId) }, visible: PostVisibility.PINNED },
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
    
    async updatePost(postId: number, updatePostDto: CreatePostDto, userId: number): Promise<Post> {
      const post = await this.getPostById(userId, postId);
  
      if (!post) {
          throw new Error('Post not found');
      }
  
      if (post.user.userId !== userId) {
          throw new Error('Unauthorized');
      }
  
      this.postRepository.merge(post, updatePostDto);
      return this.postRepository.save(post);
    }

    async deletePost(postId: number, userId: number) {
      const post = await this.getPostById(userId, postId);

      if (!post) {
        throw new Error('Post not found');
      }

      if (post.user.userId !== userId) {
        throw new Error('Unauthorized');
      }

      return this.postRepository.remove(post);
    }

}
