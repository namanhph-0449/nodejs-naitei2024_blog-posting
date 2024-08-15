import { AppDataSource } from '../config/data-source';
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

    async getPosts() {
        return await this.postRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    async getPostsByUserId(userId: number) {
        return await this.postRepository.find({
            where: { user: { userId }},
            order: { createdAt: 'DESC' }
        });
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
