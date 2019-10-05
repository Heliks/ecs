import { World } from './world';
import { System } from './system';

export class SystemManager {

    /** Contains all systems added to this manager. */
    protected systems: System[] = [];

    /**
     * @param world An entity world.
     */
    constructor(protected world: World) {}

    /**
     * Adds a system.
     *
     * @param system The system to add.
     * @returns this.
     */
    public add(system: System): this {
        this.systems.push(system);

        // system.boot(this.world);

        return this;
    }

    /**
     * Updates all systems. Should be called once on each frame.
     *
     * ```typescript
     * const wld = new World();
     * const sys = new SystemManager(wld);
     *
     * function tick(deltaTime: number): void {
     *      wld.update(deltaTime);
     *      sys.update();
     *
     *      window.requestAnimationFrame(tick);
     * }
     *
     * tick();
     * ```
     */
    public update(): void {
        for (const system of this.systems) {
            system.update(this.world);
        }
    }

}
