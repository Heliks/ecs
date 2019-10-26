import { EntityPool } from './entity-pool';
import { Storage } from './storage';
import { ClassType, EntityQuery } from './types';
import { World } from './world';
import { System } from './system';

export interface SystemWrapper {
    entities: EntityPool;
    storages: Storage[];
    system: System;
}

export interface SystemMetaData {
    query?: EntityQuery;
    storages?: ClassType[];
}

export const SYS_META_KEY = Symbol('sys-meta-data');

export function getSystemMeta(target: object): SystemMetaData {
    const meta = Reflect.getMetadata(SYS_META_KEY, target);

    if (! meta) {
        throw new Error('System is not decorated with @SystemData');
    }

    return meta;
}

export function SystemDesc(data: SystemMetaData = {}) {
    return (target: Function) => Reflect.defineMetadata(SYS_META_KEY, data, target);
}

export class SystemManager {

    /** Contains all systems added to this manager. */
    protected systems: SystemWrapper[] = [];

    /**
     * @param world An entity world.
     */
    constructor(protected world: World) {}

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

    private parseQueryMetaData(meta: SystemMetaData) {
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

    /**
     * Updates all systems. Should be called once on each frame.
     *
     * @param dt Time passed since the last frame.
     */
    public update(dt: number): void {
        for (const item of this.systems) {
            item.system.update(this.world, item.entities, ...item.storages);
        }
    }

}
