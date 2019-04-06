export default abstract class BaseSystem {

    /** Delta time */
    protected delta = 0;

    /** If set to true the system won't be executed during the update phase. {@see run} */
    protected disabled = false;

    /**
     * Executes the systems behavioral logic. This will be called on every frame during the update
     * phase unless this system is``disabled``.
     */
    abstract run(): void;

    /** Disables the system from being run. {@see run} */
    disable(): void {
        this.disabled = true;
    }

    /** Enables a system to be run again after it was disabled. {@see run} */
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
