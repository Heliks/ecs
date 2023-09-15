import { System } from './system';
import { World } from './world';


/** Unique identifier for a {@link Schedule}. */
export type ScheduleId = string | number | symbol;

/**
 * Wraps a collection of {@link System systems} and executes them in the same order
 * in which they were added to the schedule.
 */
export class Schedule {

  /**
   * Contains all scheduled {@link System systems}.
   *
   * @internal
   */
  private readonly systems: System[] = [];

  /**
   * @param id Unique identifier for this schedule.
   */
  constructor(public readonly id: ScheduleId) {}

  /** Adds the given `system`. */
  public add(system: System): this {
    this.systems.push(system);

    return this;
  }

  /** Boots all scheduled systems. */
  public boot(world: World): void {
    for (const system of this.systems) {
      system.boot?.(world);
    }
  }

  /** Updates all scheduled systems. */
  public update(world: World): void {
    for (const system of this.systems) {
      system.update(world);
    }
  }

}
