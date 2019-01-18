import EntityManager from "./entity-manager";

export default abstract class BaseSystem {

    /**
     * @type {number}
     */
    protected delta: number = 0;

    /**
     * @type {boolean}
     */
    protected disabled: boolean = false;

    /**
     * System behavior implementation
     */
    abstract run(): void;

    /**
     * Called on every update cycle. Calls ``run()`` unless this system is disabled
     *
     * @param {number} delta
     * @param {EntityManager} entityManager
     */
    update(delta: number, entityManager: EntityManager): void {
        if (! this.disabled) {
            this.delta = delta;

            this.run();
        }
    }

}