import { World } from './world';

export interface System {

    /**
     * Called once by the system manager during {@link SystemManager.update()}.
     *
     * @param world The entity world.
     */
    update(world: World): void;

}
