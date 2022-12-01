import { ComponentId, ComponentType } from './component';


/**
 * Manages known component types.
 *
 * @see ComponentId
 * @see ComponentType
 */
export class ComponentRegistry {

  /** @internal */
  private readonly ids = new Map<ComponentType, ComponentId>();

  /** @internal */
  private nextId = 0;

  /**
   * Registers a {@link ComponentType} and returns its unique {@link ComponentId}.
   *
   * Component types can only be registered once. This means that if the same type is
   * registered twice, it will retain the original {@link ComponentId} that was assigned
   * to it when it was first registered.
   */
  public register(type: ComponentType): ComponentId {
    let id = this.ids.get(type);

    if (id) {
      return id;
    }

    id = this.nextId++;

    this.ids.set(type, id);

    return id;
  }

  /**
   * Returns the {@link ComponentId component ID} for a component `type`. If that type
   * is not known to the registry, it will be {@link register registered} in the process.
   */
  public id(type: ComponentType): ComponentId {
    return this.ids.get(type) ?? this.register(type);
  }

}
