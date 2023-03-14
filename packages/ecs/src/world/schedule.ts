import { System, World } from './index';


/**
 * Unique identifier for a {@link Schedule}.
 */
export type ScheduleId = string | number | symbol;

/**
 * A schedule wraps a collection of {@link System systems} and executes them in the
 * order in which they were added.
 */
export class Schedule {

  /**
   * Contains all {@link System systems}, in the order they were added to the schedule.
   *
   * @internal
   */
  private readonly systems: System[] = [];

  /**
   * @param id Unique identifier for this schedule.
   */
  constructor(public readonly id: ScheduleId) {}

  /** Adds the given `system` to the schedule. */
  public add(system: System): this {
    this.systems.push(system);

    return this;
  }

  /** Boots all systems in the schedule. */
  public boot(world: World): void {
    for (const system of this.systems) {
      system.boot?.(world);
    }
  }

  /** Executes all systems in the schedule. */
  public update(world: World): void {
    for (const system of this.systems) {
      system.update(world);
    }
  }

}
