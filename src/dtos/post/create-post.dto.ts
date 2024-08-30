import { Tag } from '/entities/tag.entity';
import { PostVisibility } from '../../constants/post-visibility';

export class CreatePostDto {
    title: string;
    content: string;
    visible: PostVisibility;
    tags?: Tag[]
}
