import { Entity } from '@heliks/ecs';

/**
 * Component for attaching a parent entity. The entity with this component *has* a parent
 * rather than *is* a parent.
 */
export class Parent {

  /** If set to an entity, this will be the new parent. */
  public transform?: Entity;

  /**
   * @param entity The parent entity. Do not update this value directly after initially
   *  creating this component and use the `set()` method instead.
   */
  constructor(public entity: Entity) {}

  /** Sets a new parent entity. */
  public set(entity: Entity): this {
    this.transform = entity;

    return this;
  }

}
