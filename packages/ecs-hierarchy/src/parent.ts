import { Entity } from '@heliks/ecs';

/**
 * Component for attaching a parent to an entity. The entity with this component *has*
 * a parent rather than *is* a parent.
 */
export class Parent {

  /** If set to an entity, the entity will be used as the new parent. */
  public transform?: Entity;

  /**
   * @param entity Parent entity. Do not update this directly and use the `set()`
   *  method, or update the [[transform]] property instead.
   */
  constructor(public entity: Entity) {}

  /** Sets a new parent entity. */
  public set(entity: Entity): this {
    this.transform = entity;

    return this;
  }

}
