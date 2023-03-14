import { World } from './world';


/**
 * Systems will run once per frame as part of a {@link Schedule}.
 *
 * In an ECS architecture, systems are the basic building block for application logic by
 * iterating entities or components and acting on their state.
 */
export interface System {

  /**
   * Boot hook. This is where setup logic can be implemented for your system. Will be
   * called once when the {@link SystemDispatcher} boots the {@link Schedule} to which
   * this system belongs.
   */
  boot?(world: World): void;

  /** Implementation of the system logic. Will be executed once per frame. */
  update(world: World): void;

}





