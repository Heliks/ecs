import { EntityGroup } from './entity-group';
import { ClassType, Query } from './types';
import { World } from './world';

// Key used to store system metadata.
const METADATA_KEY = Symbol('sys-meta-data');

/** Returns the system meta data of the given target. */
function getMetaData(target: object): SystemMetaData {
    return Reflect.getMetadata(METADATA_KEY, target) || {};
}

/** Sets system meta data on the given target. */
function setMetaData(target: object, data: SystemMetaData): void {
    Reflect.defineMetadata(METADATA_KEY, data, target);
}

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
     * @returns Can return anything, but nothing happens with it.
     */
    update(world: World, group: EntityGroup): unknown;

}

export interface InjectStorageDescriptor {
    /** The storage of this component will be injected. */
    component: ClassType;
    /** The property to which the storage will be assigned. */
    property: string | symbol;
}

/** Data that can be attached to a system via the `@SystemData` decorator. */
export interface SystemMetaData {
    query?: Query;
    storages?: InjectStorageDescriptor[];
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
    return (target: Function) => {
        const meta = getMetaData(target);

        meta.query = data.query;

        setMetaData(target, meta);
    };
}

/**
 * Decorator to inject a storage into the property of a system.
 *
 * Note: Storages are only available after a system was added to the manager.
 *
 * ```typescript
 *
 * class Pos {
 *     x = 0;
 *     y = 0;
 * }
 *
 * @SystemData()
 * class Movement {
 *
 *     @InjectStorage(Pos) public position!: Storage<Pos>;
 *     @InjectStorage(Vel) public velocity!: Storage<Vel>;
 *
 *     update(world, group) {
 *          for (const entity of group.entities) {
 *              const position = this.position.get(entity);
 *              const velocity = this.velocity.get(entity);
 *
 *              position.x = velocity.x;
 *              position.y = velocity.y;
 *          }
 *     }
 *
 * }
 * ```
 *
 * @param component The storage for this component will be injected.
 * @returns A property decorator.
 * @decorator
 */
export function InjectStorage(component: ClassType): PropertyDecorator {
    return (target, property) => {
        const meta = getMetaData(target.constructor);

        if (! meta.storages) {
            meta.storages = [];
        }

        meta.storages.push({
            component,
            property
        });

        setMetaData(target.constructor, meta);
    };
}

export interface SystemWrapper {
    /** The group of entities that this system is processing. */
    entities: EntityGroup;
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

        // Inject storages.
        if (meta.storages) {
            for (const desc of meta.storages) {
                // eslint-disable-next-line
                (system as any)[desc.property] = this.world.storage(desc.component);
            }
        }

        this.systems.push({
            entities: this.world.group(meta.query || {}),
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
            item.system.update(this.world, item.entities);
        }
    }

}

