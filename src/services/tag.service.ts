import { In } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Tag } from '../entities/tag.entity';

export class TagService {
  private tagRepository = AppDataSource.getRepository(Tag);

  async createTag(name: string): Promise<Tag> {
    const tag = new Tag({ name });
    return await this.tagRepository.save(tag);
  }

  async createTags(names: string[]): Promise<Tag[]> {
    const promises = names.map(name => {
      const tag = new Tag({ name });
      return this.tagRepository.save(tag);
    });
    return await Promise.all(promises);
  }

  async getTags(){
    return await this.tagRepository.find({ 
      order: { name: 'ASC' },
    });
  }

  async getTagByName(name: string) {
    return await this.tagRepository.findOne({
      where: { name },
      relations: ['posts']
    });
  }

  async associateTagsWithPost(tags: Tag[]) {
    const existingTags: Tag[] = [];
    const newTags: string[] = [];

    for (const tag of tags) {
      const existingTag = await this.getTagByName(tag.name);
      if (existingTag) {
        existingTags.push(existingTag);
      } else {
        newTags.push(tag.name);
      }
    }
    const createdTags = await this.createTags(newTags);
    const postTags = existingTags.concat(createdTags);
    return postTags;
  }

  async deleteTagByName(name: string): Promise<void> {
    const tag = await this.getTagByName(name);
    if (tag) {
      await this.tagRepository.delete(tag.id);
    } else {
      throw new Error(`Tag with name '${name}' not found`);
    }
  }
}
