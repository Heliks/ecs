import { ComponentId, ComponentType } from './component';


/**
 * Manages component ID assignment to component types.
 *
 * @see ComponentId
 */
export class ComponentRegistry {

  /** @internal */
  private readonly ids = new Map<ComponentType, ComponentId>();

  /** @internal */
  private nextIdx = 0;

  /**
   * Registers a component `type` and returns the component ID that was assigned to
   * it. If it was already initialized, the existing ID will be returned.
   *
   * @see ComponentId
   */
  public register(type: ComponentType): ComponentId {
    let id = this.ids.get(type);

    if (id) {
      return id;
    }

    // Create new bit. Basically:
    // idx: 0 = id 1
    // idx: 1 = id 2
    // idx: 2 = id 4
    // ...etc
    id = 1 << this.nextIdx++;

    this.ids.set(type, id);

    return id;
  }

  /**
   * Returns the component ID for a component `type`. If that type has no ID yet, it
   * will be registered in the process.
   *
   * @see register
   */
  public id(type: ComponentType): ComponentId {
    return this.ids.get(type) ?? this.register(type);
  }

}
