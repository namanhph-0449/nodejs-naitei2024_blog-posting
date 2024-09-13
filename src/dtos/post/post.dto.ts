import { Tag } from '../../entities/tag.entity';
import { Comment } from '../../entities/comment.entity';
import { PostStats } from '../../entities/post-stats.entity';
import { PostVisibility } from '../../constants/post-visibility';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  username: string;
}

@Exclude()
export class PostDto {
  @Expose()
  postId: number;
  @Expose()
  title: string;
  @Expose()
  content: string;
  @Expose()
  imageUrl?: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  user: UserDto;
  @Expose()
  stats: PostStats;
  @Expose()
  comments?: Comment[];
  @Expose()
  tags?: Tag[];
}
