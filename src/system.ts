import { EntityPool } from './entity-pool';
import { Storage } from './storage';
import { World } from './world';

export interface System {

    /** Called when the system is added to the world. */
    boot?(world: World): void;

    update(world: World, pool: EntityPool, ...storages: Storage[]): unknown;

}

