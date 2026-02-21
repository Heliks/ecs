import { World } from './types';
import { ComponentType, Entity } from '../entity';


/**
 * A list that contains entity components. Each component type can only be added to
 * the list once.
 */
export class ComponentList {

  /** Components in this list. */
  private readonly items: object[] = [];

  /** Returns all components in this list. */
  public all(): readonly object[] {
    return this.items;
  }

  /** Returns the total number of components in this list. */
  public size(): number {
    return this.items.length;
  }

  /**
   * Adds a `component` to the list. There can only be one instance per component type
   * per list. Returns `true` if the component was successfully added to the list.
   */
  public add(component: object): boolean {
    if (this.find(component.constructor as ComponentType)) {
      return false;
    }

    this.items.push(component);

    return true;
  }

  /**
   * Returns the instance of the given component `type` from this list, or `undefined`
   * if it contains no such type.
   */
  public find<T>(type: ComponentType<T>): T | undefined {
    return this.items.find(item => item instanceof type) as T;
  }

  /**
   * Returns the instance of the given component `type` from this list. Throws an error
   * if it contains no such type.
   */
  public get<T>(type: ComponentType<T>): T {
    const component = this.find(type);

    if (! component) {
      throw new Error(`No component: ${type}`);
    }

    return component;
  }

  /** Creates an entity from all components that are added to this list. */
  public entity(world: World): Entity {
    return world.insert(...this.items);
  }

  /** Creates a new list that contains all instances of the given component types. */
  public only(...types: ComponentType[]): ComponentList {
    const list = new ComponentList();

    for (const item of this.items) {
      if (types.includes(item.constructor as ComponentType)) {
        list.add(item);
      }
    }

    return list;
  }

}
