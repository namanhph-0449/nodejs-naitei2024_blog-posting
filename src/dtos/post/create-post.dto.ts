import { IsString, IsOptional, ValidateNested, IsEnum, Exists } from 'class-validator';
import { Type } from 'class-transformer';
import { Tag } from '../../entities/tag.entity';
import { PostVisibility } from '../../constants/post-visibility';

export class CreatePostDto {
  @IsString()
  @Exists()
  title: string;

  @IsString()
  @Exists()
  content: string;

  @IsEnum(PostVisibility)
  @Exists()
  visible: PostVisibility;

  @IsOptional()
  @Type(() => Tag)
  @Exists({ nullable: true })
  tags?: Tag[];
}
