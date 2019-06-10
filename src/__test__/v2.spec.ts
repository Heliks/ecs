import { ClassType, Entity, EntityQuery, HasEntityQuery } from '../types';
import World from '../world';
import { FooBar } from './shared';
import SpyInstance = jest.SpyInstance;

interface KeyValue<T = unknown> {
    [property: string]: unknown;
}


export type ComponentFields =  number | string | boolean;

interface Component {
    [property: string]: Component | ComponentFields | ComponentFields[];
}




class PositionComponent {
    public current = [0, 0];

}

class ComponentNotFoundError extends Error {

    constructor(entity: Entity, factory: ClassType) {
        super(`Entity ${entity.toString()} does not have a ${factory.toString()} component`);
    }

}

class ComponentMapper<T> {

    /**
     * Contains all instances of the mapped component, mapped to the entity to
     * which the component belongs
     */
    protected readonly components = new Map<Entity, T>();

    /**
     * @param factory A component class constructor.
     */
    constructor(public readonly factory: ClassType<T>) {}

    /**
     * Creates a new instance of the mapped component type and assigns it to an entity.
     *
     * @param entity An Entity
     * @param data (optional) Data that should be set on the newly created instance.
     * @returns Instance of the component that we just created
     */
    add(entity: Entity, data: Partial<T> = {}): T {
        const component = new this.factory();

        Object.assign(component, data);

        this.components.set(entity, component);

        return component
    }

    /**
     * Returns the instance of the mapped component for an entity.
     *
     * @param entity Entity to which the component belongs
     * @returns Instance of the component that belongs to the given entity
     */
    get(entity: Entity): T {
        const instance = this.components.get(entity);

        if (! instance) {
            throw new ComponentNotFoundError(entity, this.factory);
        }

        return instance;
    }

    /**
     * Removes the component instance of an entity.
     *
     * @param entity An Entity
     * @returns this
     */
    remove(entity: Entity): this {
        this.components.delete(entity);

        return this;
    }

    /**
     * Returns ``true`` if a component instance exists for an entity.
     *
     * @param entity An Entity
     * @returns Boolean indicating if the entity has a component or not
     */
    has(entity: Entity): boolean {
        return this.components.has(entity);
    }

}

class TestComponent {

    public readonly foo: string = 'foo';
    public readonly bar: string = 'bar';

}

describe('ComponentMapper', () => {
    let entity: Entity;
    let mapper: ComponentMapper<TestComponent>;

    beforeEach(() => {
        entity = Symbol();
        mapper = new ComponentMapper(TestComponent);
    });

    it('should add components', () => {
        const component = mapper.add(entity, {
            bar: 'foo',
            foo: 'bar'
        });

        expect(component.bar).toBe('foo');
        expect(component.foo).toBe('bar');
    });
});




/*


export function assignEntityQueryDecorator(contains: ComponentArray = [], excludes: ComponentArray = []) {
    return <T extends EntitySystem>(target: ClassType<T> & Partial<HasEntityQuery>) => {
        target.ecsEntityQuery = {
            contains,
            excludes
        };

        return target;
    }
}

 */



function processingSystemDecorator(query: EntityQuery = {}) {
    return <T extends ProcessingSystem>(target: ClassType<T>) => {
        // statically assign entity query to class constructor
        (target as Partial<HasEntityQuery>).ecsEntityQuery = query;

        return target;
    }
}

@processingSystemDecorator({
    contains: [ FooBar ]
})
class TestSystem {
    process(entity: Entity, deltaTime: number): void {}
}

function isProcessingSystem(target: any): target is HasEntityQuery {
    return !! target.ecsEntityQuery;
}

describe('ProcessingSystem', () => {
    let process: SpyInstance;
    let system: TestSystem;
    let world: World;


    beforeEach(() => {
        system = new TestSystem();
        process = jest.spyOn(system, 'process');
        world = new World().addSystem(system);
    });


    it('should process entities', () => {


    });
});
