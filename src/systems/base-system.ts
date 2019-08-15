import { EntityManager } from '../entity-manager';

export abstract class BaseSystem {

    /** If set to ``false`` the system won't execute ``run()`` during the update phase. */
    protected _enabled = true;

    public get enabled(): boolean {
        return this._enabled;
    }

    /**
     * Called when the system is added to the world.
     *
     * @param entityManager The entity manager.
     */
    public abstract boot(entityManager: EntityManager): void;

    /**
     * Executes the systems logic.
     *
     * @param deltaTime Delta time.
     */
    protected abstract run(deltaTime: number): void;

    /**
     * Enables the system.
     *
     * @returns this
     */
    public enable(): this {
        this._enabled = true;

        return this;
    }

    /**
     * Disables the system
     *
     * @returns this
     */
    public disable(): this {
        this._enabled = false;

        return this;
    }

    /**
     * Runs the system.
     *
     * @param deltaTime Delta time.
     */
    public update(deltaTime: number): void {
        if (this._enabled) {
            this.run(deltaTime);
        }
    }

}
