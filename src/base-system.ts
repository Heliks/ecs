export default abstract class BaseSystem {

    /** Delta time */
    protected delta: number = 0;

    /**
     * Flag that indicates if the system is currently disabled. If set to true the ``run``
     * implementation will no longer be executed during the ``update`` phase.
     */
    protected disabled: boolean = false;

    /** System behavior implementation */
    abstract run(): void;

    /** Disables the system from being run. {@see disabled} */
    disable(): void {
        this.disabled = true;
    }

    /** Enables a system to be run again after it was disabled. {@see disabled} */
    enable(): void {
        this.disabled = false;
    }

    /** Clears this system. */
    clear?(): void;

    /**
     * Runs the system if it is enabled
     *
     * @param delta
     */
    update(delta: number): void {
        if (! this.disabled) {
            this.delta = delta;
            this.run();
        }
    }

}
