import { Builder, ClassType, ComponentBlueprint, Entity, Struct } from '../types';
import { World } from '../world';

describe('Archetype', () => {
    class A {
        test?: string;
    }

    class B {
        test?: string;
    }

    let world: World;

    beforeEach(() => {
        world = new World();
    });

    it('should build an entity', () => {
        const archetype = world.archetype()
            .add(A, { test: 'foo' })
            .add(B, { test: 'bar' });

        const entity = archetype.build();

        expect(world.storage(A).get(entity).test).toBe('foo');
        expect(world.storage(B).get(entity).test).toBe('bar');
    });

    it('should build many unique entities from the same archetype', () => {
        const archetype = world.archetype().add(A, {
            test: 'foobar'
        });

        const entity1 = archetype.build();
        const entity2 = archetype.build();

        // Make sure each entity is unique.
        expect(entity1).not.toBe(entity2);

        expect(world.storage(B).get(entity1).test).toBe('foobar');
        expect(world.storage(B).get(entity2).test).toBe('foobar');
    });
});
