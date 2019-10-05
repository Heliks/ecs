import { World } from './world';

export interface System {

    /** Called when the system is added to the world. */
    boot?(world: World): void;

    /** Called once by the system manager during {@link SystemManager.update()}. */
    update(world: World): unknown;

}

