import { EntityBuilder } from './entity-builder';
import { World } from './world';


/** Unique identifier for a {@link Preset preset}. */
export type PresetId = string;

/**
 * Presets create {@link EntityBuilder entity builders} with pre-defined component. They
 * are useful for composing similar kinds of entities without having to manually compose
 * them from scratch every time.
 */
export interface Preset {

  /**
   * Called when an entity is created with this preset. This function is supposed to
   * create the basic setup for the entity and return its entity builder.
   */
  create(world: World): EntityBuilder;

}

/** Utility that manages entity {@link Preset presets}. */
export class Presets {

  /** @internal */
  private readonly items = new Map<PresetId, Preset>();

  /**
   * Adds a {@link Preset preset} using the specified {@link PresetId id}. Throws an
   * error if that ID is already in use by another preset.
   */
  public set(id: PresetId, value: Preset): this {
    if (this.items.has(id)) {
      throw new Error(`Preset ID ${id} is already in use`);
    }

    this.items.set(id, value);

    return this;
  }

  /**
   * Returns the {@link Preset} with the specified {@link PresetId id}, or `undefined`
   * if no such preset exists.
   */
  public get<T extends Preset = Preset>(id: PresetId): T | undefined {
    return this.items.get(id) as T;
  }

  /**
   * Create a new {@link EntityBuilder entity} using the {@link Preset} matching the
   * specified {@link PresetId id} as base. Throws an error if no such preset exists.
   */
  public create(world: World, id: PresetId): EntityBuilder {
    const preset = this.items.get(id);

    if (! preset) {
      throw new Error(`Invalid preset ${id}`);
    }

    return preset.create(world);
  }

}
