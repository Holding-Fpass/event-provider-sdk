import { Channel } from "./channel";
import { Contract } from "./contract";
import { Form } from "./form";
import { Resource, ResourceType } from "./resource";
import { Stage } from "./stage";
import { Subtitle } from "./subtitle";
import { Tag } from "./tag";
import { User } from "./user";
import { Whitelabel } from "./whitelabel";

// Content

export enum ContentItemType {
  DOWNLOAD = "download",
  LINK = "link",
}
export class ContentItem extends Resource {
  resourceType = ResourceType.CONTENT_ITEM;
  type!: ContentItemType;
  name?: string;
  // Media
  resourceUrl?: string;
  fileUrl?: string;
}

export class ContentForms {
  contentEndForm?: Partial<Form>;
  userTestForm?: Partial<Form>;
}

export enum ContentType {
  VIDEO = "video",
  MEET = "meet",
  LIVE = "live",
}

export enum ContentStatus {
  CREATED = "created",
  ACTIVE = "active",
}

export const ContentStatusTransitionMap = new Map<
  ContentStatus,
  ContentStatus[]
>([[ContentStatus.CREATED, [ContentStatus.ACTIVE]]]);

export class Content extends Resource<ContentStatus> {
  resourceType = ResourceType.CONTENT;
  transitionMap = ContentStatusTransitionMap;
  type!: ContentType;
  name!: string;
  slug?: string;
  description?: string;
  // Media
  image144x80?: string;
  image1440x720?: string;
  video1920x1080?: string;
  video1920x1080_duration?: number;
  video1920x1080_subtitles?: Subtitle[];
  // Transmission
  rtmpUrl?: string;
  meetUrl?: string;
  // Date
  dateStart?: string;
  dateEnd?: string;
  // Forms
  forms?: Partial<ContentForms>;
  // Payment
  free?: boolean;
  // Related
  stage?: Pick<Stage, "resourceId" | "name" | 'slug'>;
  mentors?: Pick<User, "resourceId" | "name" | "email">[];
  tags?: Tag[];
  parentId!: string;
  parentType!: ResourceType;
  items?: Partial<ContentItem>[];
}

// Module
export class Module extends Resource {
  resourceType = ResourceType.MODULE;
  name!: string;
  description?: string;
  // Media
  image256x256?: string;
  // Related
  contents?: Partial<Content>[];
}

// Course

export enum CourseStatus {
  CREATED = "created",
  ACTIVE = "active",
  UNAVALIABLE = "unavaliable",
}

interface FAQ {
  title: string;
  response: string;
}

interface Knowledge {
  image80x80?: string;
  title?: string;
  subtitle?: string;
  items?: KnowledgeItens[];
}

interface KnowledgeItens {
  id: string;
  description?: string;
}

export class CourseForms {
  feedbackForm?: Partial<Form>;
  certificateForm?: Partial<Form>;
  publicRatingForm?: Partial<Form>;
}

export const CourseStatusTransitionMap = new Map<CourseStatus, CourseStatus[]>([
  [CourseStatus.CREATED, [CourseStatus.ACTIVE]],
  [CourseStatus.ACTIVE, [CourseStatus.UNAVALIABLE]],
]);
export class Course extends Resource<CourseStatus> {
  resourceType = ResourceType.COURSE;
  transitionMap = CourseStatusTransitionMap;
  resourceId!: string;
  name!: string;
  description?: string;
  slug?: string;
  premium?: boolean;
  hide?: boolean;
  spotlight?: boolean;
  // General
  whitelabel!: Whitelabel;
  tags?: Tag[];
  knowledge?: Knowledge[];
  producer?: User;
  channel?: Channel;
  contract?: Partial<Contract>;
  faq?: FAQ[];
  // Media
  image1272x203?: string;
  image128x128?: string;
  image1400x720?: string;
  image400x512?: string;
  // Dates
  dateStart?: string;
  dateEnd?: string;
  // Purchase
  value?: number;
  paymentStart?: string;
  paymentEnd?: string;
  // Related
  contents?: Partial<Content>[];
  modules?: Partial<Module>[];
  forms?: CourseForms;
}
