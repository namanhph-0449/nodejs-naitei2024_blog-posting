export class CreateCommentDto {
    postId: number;
    content: string;
    parentCommentId?: number; // Optional, for replies
}
