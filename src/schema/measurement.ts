import { WhereFilterOp } from "firebase-admin/firestore";
import { ProviderExtra } from "./provider";
import { Resource, ResourceType } from "./resource";
import { User } from "./user";

export enum MeasurementType {
  // Page
  PAGE_VIEW = "pageview",
  // Course
  COURSE_CLICK = "course.click",
  COURSE_OPEN = "course.open",
  // Content
  CONTENT_CLICK = "content.open",
  CONTENT_VIEW = "content.view",
  // Response
  RESPONSE_AVG = "response.avg",
  RESPONSE_COUNT = "response.count",
}

export enum MeasurementStatus {
  CREATED = "created",
  PROVIDER_CREATED = "provider.created",
  PROVIDER_EXECUTED = "provider.executed",
  ACTIVE = "active",
  DELETED = "deleted",
}

export const MeasurementStatusTransitionMap = new Map<
  MeasurementStatus,
  MeasurementStatus[]
>([
  [MeasurementStatus.CREATED, [MeasurementStatus.PROVIDER_CREATED]],
  [MeasurementStatus.PROVIDER_CREATED, [MeasurementStatus.PROVIDER_EXECUTED]],
  [MeasurementStatus.PROVIDER_EXECUTED, [MeasurementStatus.ACTIVE]],
  [MeasurementStatus.ACTIVE, [MeasurementStatus.DELETED]],
]);

export class MeasurementFilterValues {
  key!: string;
  operator!: WhereFilterOp;
  value!: string;
}
export class MeasurementFilter {
  userId!: string;
  resourceId!: string;
  resourceType!: ResourceType;
  resourceValues!: MeasurementFilterValues[];
  dateStart!: string;
  dateEnd!: string;
}
export class Measurement extends Resource<MeasurementStatus> {
  resourceType = ResourceType.MEASUREMENT;
  transitionMap = MeasurementStatusTransitionMap;
  //
  type!: MeasurementType;
  filter!: Partial<MeasurementFilter>;
  filterHash!: string;
  user!: Partial<User>;
  value!: string;
  // Provider
  force!: boolean;
  permanent!: boolean;
  providerExtra?: ProviderExtra[];
}
