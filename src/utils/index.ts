import { Request } from 'express';
import { UserRole } from '../constants/user-roles';
import { UserStatus } from '../constants/user-status';
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
