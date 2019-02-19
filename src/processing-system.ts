import EntityPool from "./entity-pool";
import EntitySystem from "./entity-system";
import { Entity } from "./types";

export default abstract class ProcessingSystem extends EntitySystem {

    /**
     * Called once for each entity that is pooled by this system during the ``update`` phase.
     *
     * @param entity    One of the pooled entities
     */
    abstract process(entity: Entity): void;

    /** Iterates over all pooled entities and calls ``process()`` for each one */
    run(): void {
        // don't use ``getPool`` here because we are certain that ``this.pools`` is not empty at this point
        for (const entity of (<EntityPool>this.pool).entities) {
            this.process(entity);
        }
    }

}