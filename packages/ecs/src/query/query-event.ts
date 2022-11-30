import { Entity } from '../entity';


/** @see QueryEvent */
export enum QueryEventType {
  /** Entity was added to the query. */
  Added,
  /** Entity was removed from the query. */
  Removed
}

/** Event that occurs when changes happen to the entity pool of a query. */
export class QueryEvent {

  /** Contains `true` if the type of this event is `QueryEventType.Added`. */
  public get isAdded(): boolean {
    return this.type === QueryEventType.Added;
  }

  /** Contains `true` if the type of this event is `QueryEventType.Removed`. */
  public get isRemoved(): boolean {
    return this.type === QueryEventType.Removed;
  }

  /**
   * @param type Event type.
   * @param entity The entity that triggered this event.
   */
  constructor(public readonly type: QueryEventType, public readonly entity: Entity) {}

  /** Creates a new `QueryEvent` with type `QueryEventType.Added`. */
  public static added(entity: Entity): QueryEvent {
    return new QueryEvent(QueryEventType.Added, entity);
  }

  /** Creates a new `QueryEvent` with type `QueryEventType.Removed`. */
  public static removed(entity: Entity): QueryEvent {
    return new QueryEvent(QueryEventType.Removed, entity);
  }

}
