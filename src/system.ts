import { EntityPool } from './entity-pool';
import { Storage } from './storage';
import { ClassType, EntityQuery } from './types';
import { World } from './world';

/**
 * A system handles game logic by iterating over a set of entities. Each
 * system must be decorated with `@SystemData`.
 */
export interface System {

    /** Called when the system is added to the world. */
    boot?(world: World): void;

    /**
     * Runs the systems logic. Called once on each frame.
     *
     * @param world The world from which the system was executed.
     * @param pool A pool that contains all entities that match the systems query.
     * @param storages
     * @returns Can return anything, but nothing happens with it.
     */
    update(world: World, pool: EntityPool, ...storages: Storage[]): unknown;

}

/** Data that can be attached to a system via the `@SystemData` decorator. */
export interface SystemMetaData {

    /** */
    query?: EntityQuery;

    /** */
    storages?: ClassType[];

}

// Key used to store system metadata.
export const SYS_META_KEY = Symbol('sys-meta-data');

/** Returns system meta data from the given target. */
export function getSystemMeta(target: object): SystemMetaData {
    const meta = Reflect.getMetadata(SYS_META_KEY, target);

    if (! meta) {
        throw new Error('System is not decorated with @SystemData');
    }

    return meta;
}

/**
 * Decorator to add meta data to a system.
 *
 * ``ts
 * @SystemDesc({
 *     // ...
 * })
 * class Foo implements System {
 *     // ...
 * }
 *
 * ``
 *
 * @param data The meta-data that should be added to the system.
 * @returns A class decorator.
 */
export function SystemDesc(data: SystemMetaData = {}): ClassDecorator {
    return (target: Function) => Reflect.defineMetadata(SYS_META_KEY, data, target);
}

export interface SystemWrapper {

    /** Entity pool.*/
    entities: EntityPool;

    /** Component storages. */
    storages: Storage[];

    /** The system that is executed on each frame. */
    system: System;

}

export class SystemManager {

    /** Contains all systems added to this manager. */
    protected systems: SystemWrapper[] = [];

    /**
     * @param world An entity world.
     */
    constructor(protected world: World) {}

    /** @hidden */
    private parseStorageMetaData(meta: SystemMetaData): Storage[] {
        const components = [];

        // Use storage config from meta-data if set. Otherwise try to auto-resolve
        // from the "contains" part in the entity query.
        if (meta.storages) {
            components.push(...meta.storages);
        }
        else if (meta.query && meta.query.contains) {
            components.push(...meta.query.contains);
        }

        return components.map(component => this.world.storage(component));
    }

    /** @hidden */
    private parseQueryMetaData(meta: SystemMetaData): EntityPool {
        return this.world.entities.registerPool(this.world.createFilter(
            meta.query || {}
        ));
    }

    /**
     * Adds a system.
     *
     * @param system The system to add.
     * @returns this.
     */
    public add(system: System): this {
        const meta = getSystemMeta(system);

        this.systems.push({
            entities: this.parseQueryMetaData(meta),
            storages: this.parseStorageMetaData(meta),
            system
        });

        if (system.boot) {
            system.boot(this.world);
        }

        return this;
    }

    /** Updates all systems. Should be called once on each frame. */
    public update(): void {
        for (const item of this.systems) {
            item.system.update(this.world, item.entities, ...item.storages);
        }
    }

}
