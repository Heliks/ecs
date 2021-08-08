import { Entity } from '../entity';
import { ClassType } from '../common';
import { Storage } from '../storage';

/** */
export interface EntityQuery {
  contains?: ClassType[];
  excludes?: ClassType[];
}

export interface World {

  /**
   * Creates a new entity. If any `components` are given they will be automatically
   * attached to it.
   */
  create(components?: object[]): Entity;

  /**
   * Registers a storage for the component `T`.
   */
  register<T>(component: ClassType<T>): Storage<T>;

  /**
   * Returns the storage for component `T`. If no storage for this component
   * exists it will be registered automatically.
   */
  storage<T>(component: ClassType<T>): Storage<T>;

}
