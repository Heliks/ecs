import { Entity } from '@heliks/ecs';

/**
 * Component for attaching a parent entity. The entity with this component *has* a parent
 * rather than *is* a parent.
 */
export class Parent {

  /**
   * @param entity The parent entity.
   */
  constructor(public entity: Entity) {}

}
