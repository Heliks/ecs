import { Schedule, ScheduleId } from './schedule';
import { World } from './world';


export class SystemDispatcher {

  /** @internal */
  private readonly schedules: Schedule[] = [];

  /**
   * Returns the index position of the schedule matching `id`. Returns `-1` if that ID
   * does not match any schedules.
   */
  public getIndex(id: ScheduleId): number {
    return this.schedules.findIndex(layer => layer.id === id);
  }

  /** @internal */
  private insertAt(schedule: Schedule, index: number): void {
    this.schedules.splice(index, 0, schedule);
  }

  /** Inserts a {@link Schedule schedule}, using the given {@link ScheduleId id}. */
  public add(id: ScheduleId): Schedule {
    const schedule = new Schedule(id);

    this.schedules.push(schedule);

    return schedule;
  }

  /**
   * Inserts a {@link Schedule schedule}, using the given {@link ScheduleId id}. The
   * schedule will be executed before the schedule matching `before`.
   */
  public before(id: ScheduleId, before: ScheduleId): Schedule {
    const layer = new Schedule(id);

    this.insertAt(layer, this.getIndex(before));

    return layer;
  }

  /**
   * Inserts a {@link Schedule schedule}, using the given {@link ScheduleId id}. The
   * schedule will be executed after the schedule matching `after`.
   */
  public after(id: ScheduleId, after: ScheduleId): Schedule {
    const schedule = new Schedule(id);

    this.insertAt(schedule, this.getIndex(after) + 1);

    return schedule;
  }

  /** Returns the {@link Schedule} matching the given {@link ScheduleId}, if any.*/
  public get(id: ScheduleId): Schedule | undefined {
    return this.schedules[ this.getIndex(id) ];
  }

  /** Boots all schedules. */
  public boot(world: World): void {
    for (const schedule of this.schedules) {
      schedule.boot(world);
    }
  }

  /** Runs all schedules. */
  public update(world: World): void {
    for (const schedule of this.schedules) {
      schedule.update(world);
    }
  }

}
