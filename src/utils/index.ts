import { Request } from 'express';
import { UserRole } from '../constants/user-roles';
import { UserStatus } from '../constants/user-status';
import { Tag } from '../entities/tag.entity';
import { BLOCK_LIST_ITEM_TAGS,
        MAX_PREVIEW_LENGTH } from '../constants/';
import DOMPurify from "isomorphic-dompurify";

export function validateSessionRole(req: Request) {
  return req.session.user ? req.session.user.role : null;
}

export function validateAdminRole(req: Request) {
  return req.session.user?.role === UserRole.ADMIN;
}

export function validateActiveUser(status?: UserStatus) {
  return status === UserStatus.ACTIVE;
}

export function shortenContent(content: string) {
  if (content.length <= MAX_PREVIEW_LENGTH) {
    return content;
  }
  const trimmedContent = content.slice(0, MAX_PREVIEW_LENGTH);
  return trimmedContent + '...';
}

export function sanitizeContent(content: string) {
  const sanitized = DOMPurify.sanitize(content, {
    FORBID_TAGS: BLOCK_LIST_ITEM_TAGS
  });
  return sanitized;
}

export function reformatTimestamp(timestampStr: Date) {
  // Create a Date object from the timestamp string
  const date = new Date(timestampStr);

  // Extract the day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();

  // Extract hours and minutes
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Return the formatted string
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function mapTagsToTagEntities(tags: string[]): Tag[] {
  return tags.map(name => {
    const tag = new Tag();
    tag.name = name;
    return tag;
  });
}

export function mapTagEntitiesToTags(tags: Tag[]): string[] {
  return tags.map(tag => tag.name);
}
