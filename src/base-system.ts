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
     * Disables the system so that it no longer will be ``run``
     */
    disable(): void {
        this.disabled = true;
    }

    /**
     * Enables the system so that its ``run`` implementation will be called.
     */
    enable(): void {
        this.disabled = false;
    }

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