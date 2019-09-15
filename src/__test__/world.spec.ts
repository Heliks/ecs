import { EntityPool } from '../entity-pool';
import { World } from '../world';
import { BarCmp, FooCmp } from './shared';
import { Entity } from '../types';

describe('World', () => {
    class WorldMock extends World {

        /** Returns true if the composition Id of the given entity is empty. */
        public isCompositionEmpty(entity: Entity): boolean {
            return this.compositionId(entity).isEmpty();
        }

        public isDirty(entity: Entity): boolean {
            return this.dirty.indexOf(entity) > -1;
        }

    }

    let world: WorldMock;

    beforeEach(() => {
        world = new WorldMock();
    });

    it('should spawn an entity', () => {
        world.spawn();

        expect(world.getEntities()).toHaveLength(1);
    });

    describe('despawn()', () => {
        let entity1: symbol;
        let entity2: symbol;

        beforeEach(() => {
            entity1 = world.spawn();
            entity2 = world.spawn();
        });

        it('should de-spawn an entity', () => {
            const entities = world
                .despawn(entity2)
                .getEntities();

            expect(entities).toContain(entity1);
            expect(entities).not.toContain(entity2);
        });

        it('should reset composition ids', () => {
            // Add a component and de-spawn the entity
            world.add(entity1, FooCmp).despawn(entity1);

            expect(world.isCompositionEmpty(entity1)).toBeTruthy();
        });

        it('should remove de-spawned entities from pools', () => {
            const pool = world.pool({
                contains: [FooCmp]
            });

            // Compose & add entities
            world
                .add(entity1, FooCmp)
                .add(entity2, FooCmp)
                .synchronize();

            // Des-pawn entity2 again.
            world.despawn(entity2).synchronize();

            // Tests against false-positives where synchronization failed and the entities
            // where never added to the pools in the first place.
            expect(pool.has(entity1)).toBeTruthy();
            // Entity should be removed.
            expect(pool.has(entity2)).toBeFalsy();
        });
    });

    it('should add a component to an entity', () => {
        const entity = world.spawn();

        const success = world
            .add(entity, FooCmp)
            .has(entity, FooCmp);

        expect(success).toBeTruthy();
    });

    it('should remove a component from an entity', () => {
        const entity = world.spawn();

        world
            .add(entity, FooCmp)
            .add(entity, BarCmp)
            .remove(entity, FooCmp);

        expect(world.has(entity, FooCmp)).toBeFalsy();
        expect(world.has(entity, BarCmp)).toBeTruthy();
    });

    describe('synchronize()', () => {
        let entity: Entity;
        let pool: EntityPool;

        beforeEach(() => {
            entity = world.spawn();

            pool = world.pool({
                contains: [ FooCmp, BarCmp ]
            });
        });

        it('should add entities to eligible pools', () => {
            world
                .add(entity, FooCmp)
                .add(entity, BarCmp)
                .synchronize();

            expect(pool.has(entity)).toBeTruthy();
        });

        it('should remove entities from non-eligible pools', () => {
            // Entity should be part of the pool after first synchronize
            world
                .add(entity, FooCmp)
                .add(entity, BarCmp)
                .synchronize();

            // Next synchronize should remove the entity again.
            world.remove(entity, FooCmp).synchronize();

            expect(pool.has(entity)).toBeFalsy();
        });
    });

    function testAddComponent(entity: Entity) {
        it('should add a component to an entity', () => {
            expect(world.mapper(FooCmp).has(entity)).toBeTruthy();
        });

        it('should flag the entity as dirty', () => {
            expect(world.isDirty(entity)).toBeTruthy();
        });
    }
    describe('add()', () => {
        // Todo: Test for compositionId update.
        let entity: Entity;

        beforeEach(() => {
            entity = world.spawn();
            // Add component via type.
            world.add(entity, FooCmp);
        });

        it('should add a component to an entity', () => {
            expect(world.mapper(FooCmp).has(entity)).toBeTruthy();
        });

        it('should flag the entity as dirty', () => {
            expect(world.isDirty(entity)).toBeTruthy();
        });
    });

    describe('addInstance()', () => {
        // Todo: Test for compositionId update.
        let entity: Entity;

        beforeEach(() => {
            entity = world.spawn();
            // Add component via type.
            world.addInstance(entity, new FooCmp());
        });

        it('should add a component to an entity', () => {
            expect(world.mapper(FooCmp).has(entity)).toBeTruthy();
        });

        it('should flag the entity as dirty', () => {
            expect(world.isDirty(entity)).toBeTruthy();
        });
    });
});
