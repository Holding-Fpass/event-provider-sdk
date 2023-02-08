import { Timestamp } from "firebase-admin/firestore";
import {
  FormTrigger,
  Notification,
  NotificationStatus,
  NotificationTrigger,
  NotificationType,
  ResourceType,
  StoryTrigger,
} from "../../../schema";
import {
  CommonFirestoreRepository,
  ICommonFirestoreRepositoryConstructorParams,
} from "./common.repository";

interface ICommonFirestoreRepositoryWithSubRepositoryConstructorParams
  extends Omit<
    ICommonFirestoreRepositoryConstructorParams,
    "entity" | "baseEntity"
  > {
  baseEntityResourceId: string;
}

export class UserNotificationFirestoreRepository extends CommonFirestoreRepository<Notification> {
  public constructor(
    params: ICommonFirestoreRepositoryWithSubRepositoryConstructorParams
  ) {
    const superParams: ICommonFirestoreRepositoryConstructorParams = {
      whitelabel: params.whitelabel,
      baseEntity: ResourceType.USER,
      baseEntityResourceId: params.baseEntityResourceId,
      entity: ResourceType.NOTIFICATION,
    };
    super(superParams);
  }

  public async findApplicable(
    type: NotificationType
  ): Promise<Notification[] | undefined> {
    const snapshot = await this.firestore
      .collection(this.baseCollectionPath)
      .where("type", "==", type)
      .where("deletedAt", ">=", Timestamp.now())
      .get();
    return this.snapshotGetAll(snapshot);
  }

  public async findApplicableByTypeAndTrigger(
    type: NotificationType,
    trigger: StoryTrigger | NotificationTrigger | FormTrigger
  ): Promise<Notification[] | undefined> {
    let snapshot = await this.firestore
      .collection(this.baseCollectionPath)
      .where("type", "==", type)
      .where("trigger", "==", trigger)
      .where("deletedAt", ">", Timestamp.now())
      .where("readed", "==", false)
      .get();

    return this.snapshotGetAll(snapshot);
  }

  public async findApplicableByTrigger(
    trigger: NotificationTrigger
  ): Promise<Notification[] | undefined> {
    let snapshot = await this.firestore
      .collection(this.baseCollectionPath)
      .where("trigger", "==", trigger)
      .where("deletedAt", ">", Timestamp.now())
      .where("readed", "==", false)
      .orderBy("createdAt", "desc")
      .get();

    return this.snapshotGetAll(snapshot);
  }

  public async setReadedAt(id: string): Promise<Notification | undefined> {
    await this.firestore
      .collection(this.baseCollectionPath)
      .doc(id)
      .update({
        readed: true,
      } as Pick<Notification, "readed">);
    return this.findById(id) as Promise<Notification>;
  }

  public async unsetReadedAt(id: string): Promise<Notification | undefined> {
    await this.firestore
      .collection(this.baseCollectionPath)
      .doc(id)
      .update({
        readed: false,
      } as Pick<Notification, "readed">);
    return this.findById(id) as Promise<Notification>;
  }

  public async remove(id: string): Promise<Notification | undefined> {
    await this.firestore
      .collection(this.baseCollectionPath)
      .doc(id)
      .update({
        deletedAt: Timestamp.now(),
        status: NotificationStatus.DELETED,
      } as Pick<Notification, "deletedAt">);
    return this.findById(id) as Promise<Notification>;
  }
}
