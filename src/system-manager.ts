import { World } from './world';
import { System } from './system';

export class SystemManager {

    /** Contains all systems added to this manager. */
    protected systems: System[] = [];

    /**
     * Adds a system.
     *
     * @param system The system to add.
     * @returns this.
     */
    public add(system: System): this {
        this.systems.push(system);

        return this;
    }

    /**
     * Updates all registered systems. Should be called once on each frame.
     *
     * Systems should be updated after the world so that entities and delta
     * times are synchronized correctly.
     *
     * ```typescript
     * const manager = new SystemManager();
     * const world = new World();
     *
     * function tick(deltaTime: number): void {
     *     // Update before the system manager.
     *     world.update(deltaTime);
     *     systems.update(world);
     *
     *     window.requestAnimationFrame(tick);
     * }
     *
     * tick();
     * ```
     *
     * @param world The entity world.
     */
    public update(world: World): void {
        for (const system of this.systems) {
            system.update(world);
        }
    }

}
