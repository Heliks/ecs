import { Builder, ClassType, Entity, World } from './types';

export class EntityBuilder implements Builder {

    /** The entity that this builder is composing. */
    protected readonly entity: Entity = Symbol();

    /** Indicates if ``build()`` was already called on this builder. */
    protected isBuilt = false;

    /** World in which this builder was created. */
    constructor(protected world: World) {}

    /**
     * Adds a component to the entity.
     *
     * @param component The component to add.
     * @param data (optional) Data that should be assigned to the component.
     * @returns this
     */
    public add<T>(component: ClassType<T>, data?: Partial<T>): this {
        this.world.storage(component).add(this.entity, data);

        return this;
    }

    /** {@inheritDoc Builder.build()} */
    public build(): Entity {
        if (this.isBuilt) {
            throw new Error('Entity is already built');
        }

        this.world.insert(this.entity, true);
        this.isBuilt = true;

        return this.entity;
    }

}
