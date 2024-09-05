import { DataSource, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { TagService } from '../services/tag.service';
import { AppDataSource } from '../config/data-source';

let connection: DataSource;
let tagService: TagService;

const newTagNames = ["Test0", "Test1", "Test2"];

beforeAll(async () => {
  connection = await AppDataSource.initialize();
  tagService = new TagService();
});

afterAll(async () => {
  await connection.destroy();
});

describe('Tag Service', () => {
  it('should creates a new tag', async () => {
    const newTagName = "New Tag";
    const createdTag = await tagService.createTag(newTagName);
    const retrievedTag = await tagService.getTagByName(newTagName);
    expect(retrievedTag!.name).toEqual(createdTag!.name);
    // clean
    await tagService.deleteTagByName(newTagName);
  });

  it ('should creates new tags at once', async() => {
    const createdTags = await tagService.createTags(newTagNames);
    expect(createdTags.length).toBe(newTagNames.length);

    for (const tagName of newTagNames) {
      const retrievedTag = await tagService.getTagByName(tagName);
      expect(retrievedTag).toBeDefined();
      expect(retrievedTag!.name).toBe(tagName);
    }
  });

  it ('should returns all tags', async() => {
    const allTags = await tagService.getTags();
    expect(allTags.length).toBeGreaterThanOrEqual(newTagNames.length);

    for (const tagName of newTagNames) {
      expect(allTags.some(tag => tag.name === tagName)).toBe(true);
    }
  });

  it ('should delete tag', async() => {
    for (const tagName of newTagNames) {
      await tagService.deleteTagByName(tagName);
    }

    for (const tagName of newTagNames) {
      const retrievedTag = await tagService.getTagByName(tagName);
      expect(retrievedTag).toBeNull();
    }
  });

  it ('should return an error when deleting not exist tag', async() => {
    for (const tagName of newTagNames) {
      await expect(tagService.deleteTagByName(tagName))
        .rejects
        .toThrowError(`Tag with name '${tagName}' not found`);
    }
  });
});
