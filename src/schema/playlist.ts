import { Course } from "./course";
import {
  Resource,
  ResourceType,
  DisplayResource,
  SearchableResource,
} from "./resource";
import { Tag } from "./tag";

export class Playlist extends Resource implements SearchableResource {
  resourceType = ResourceType.PLAYLIST;
  name!: string;
  // Media
  image256x256?: string;
  // Related
  courses?: Partial<Course>[];
  userTags?: Partial<Tag>[];
  // SearchableResource implementation
  isPublic = true;
  asDisplayResource(resource: any): DisplayResource {
    const data = resource as Playlist;
    return {
      resourceType: ResourceType.PLAYLIST,
      resourceId: data.resourceId,
      h1: data.name,
    };
  }
}
