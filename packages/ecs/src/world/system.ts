import { World } from './world';


/**
 * Runs once per frame as part of a {@link Schedule}.
 *
 * Systems are the basic building block for application logic. They iterate over
 * entities and their components and act on their state (data oriented design).
 *
 * @see SystemDispatcher
 */
export interface System {

  /**
   * System boot.
   *
   * This is where setup logic for the system can be implemented. Usually this function
   * will only be called once per {@link SystemDispatcher dispatcher} life-time, which
   * is when the dispatcher boots the {@link Schedule} to which this system belongs.
   */
  boot?(world: World): void;

  /**
   * Update tick.
   *
   * This is where the logic for this system can be implemented. Usually this function
   * will be called once per frame, when the {@link Schedule} to which this system
   * belongs is updated by the {@link SystemDispatcher dispatcher}.
   */
  update(world: World): void;

}





