import { EntityGroup } from './entity-group';
import { Storage } from './storage';
import { ClassType, Query } from './types';
import { World } from './world';

// Key used to store system metadata.
export const METADATA_KEY = Symbol('sys-meta-data');

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
     * @param group The group of entities over which this system iterates.
     * @param storages
     * @returns Can return anything, but nothing happens with it.
     */
    update(world: World, group: EntityGroup, ...storages: Storage[]): unknown;

}

/** Data that can be attached to a system via the `@SystemData` decorator. */
export interface SystemMetaData {

    /** */
    query?: Query;

    /** */
    storages?: ClassType[];

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
export function SystemData(data: SystemMetaData = {}): ClassDecorator {
    return (target: Function) => Reflect.defineMetadata(METADATA_KEY, data, target);
}

export interface SystemWrapper {

    /** The group of entities that this system is processing. */
    entities: EntityGroup;

    /**
     * Component storages. In most cases this will contain the `contains` part
     * of the `Query` that is passed to the `@SystemData`.
     */
    storages: Storage[];

    /** The system. */
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

    /**
     * Adds a system.
     *
     * @param system The system to add.
     * @returns this.
     */
    public add(system: System): this {
        const meta = Reflect.getMetadata(METADATA_KEY, system.constructor);

        if (! meta) {
            throw new Error('System is not decorated with @SystemData');
        }

        this.systems.push({
            entities: this.world.group(meta.query || {}),
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
            item.system.update(
                this.world,
                item.entities,
                ...item.storages
            );
        }
    }

}
