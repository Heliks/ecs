import { EntityBuilder } from './entity-builder';
import { Builder, ClassType, ComponentBlueprint, Entity, World } from './types';

/**
 * An entity builder that can be used to produce multiple entities (An entity archetype).
 */
export class Archetype implements Builder {

    /** Holds information on how to assign components to an entity. */
    protected components: ComponentBlueprint[] = [];

    /**
     * @param world Entity world.
     */
    constructor(protected world: World) {}

    /**
     * Adds a component to the builder.
     *
     * @param component The component type.
     * @param data (optional) Data that should initially be assigned to the component.
     * @returns this
     */
    public add<T>(component: ClassType<T>, data?: Partial<T>): this {
        this.components.push({
            component,
            data
        });

        return this;
    }

    /** Builds and returns the final entity. */
    public build(): Entity {
        const entity = Symbol();
        const world = this.world;

        for (const item of this.components) {
            world.storage(item.component).add(entity, item.data);
        }

        world.insert(entity);

        return entity;
    }

    /**
     * Returns an entity builder based on this archetype.
     *
     * ```typescript
     * const archetype = world.archetype().add(Health, { max: 100, val: 100 });
     *
     * // Will be created with "Health" and "Transform".
     * const entity1 = archetype.toBuilder().add(Transform, { x: 10, y: 10 }).build();
     * const entity2 = archetype.toBuilder().add(Transform, { x: 20, y: 20 }).build();
     * ```
     */
    public toBuilder(): EntityBuilder {
        const builder = new EntityBuilder(this.world);

        for (const item of this.components) {
            builder.add(item.component, item.data);
        }

        return builder;
    }

}
