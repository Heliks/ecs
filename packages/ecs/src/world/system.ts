import { World } from './world';


/** Where all the logic of an entity system is implemented. */
export interface System {

  /**
   * Setup logic for your game goes here. Will be called when the system is added to
   * the `SystemDispatcher`.
   */
  boot?(world: World): void;

  /**
   * Logic implementation of the game system. This is executed once on each frame by
   * the system dispatcher.
   */
  update(world: World): void;

}

/** Manages and updates systems. */
export class SystemDispatcher {

  /** All systems that were added to the manager. */
  protected systems: System[] = [];

  /**
   * @param world The entity world.
   */
  constructor(public readonly world = new World()) {}

  /** Adds the given `system`. */
  public add(system: System): this {
    // Boot the system if necessary.
    if (system.boot) {
      system.boot(this.world);
    }

    this.systems.push(system);

    return this;
  }

  /**
   * Updates all systems that were added to the manager. Should be
   * called once on each frame.
   */
  public update(): void {
    for (const system of this.systems) {
      system.update(this.world);
    }
  }

}
