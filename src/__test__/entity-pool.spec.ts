import { BarCmp, FooCmp } from './shared';
import { EntityPool } from '../entity-pool';
import { World } from '../world';
import { Entity } from '../types';

describe('EntityPool', () => {
    class WorldMock extends World {

        /**
         * Returns true if the given entity is allowed to join the given pool
         *
         * @param pool An entity pool.
         * @param entity An entity.
         * @returns True if entity can join pool.
         */
        public testPool(pool: EntityPool, entity: Entity): boolean {
            return pool.test(this.compositionId(entity));
        }

    }

    let world: WorldMock;

    beforeEach(() => {
        world = new WorldMock();
    });

    it('should validate if an entity is eligible to join', () => {
        const pool = world.pool({
            contains: [FooCmp],
            excludes: [BarCmp]
        });

        const entity1 = world.spawn();
        const entity2 = world.spawn();

        world.add(entity1, FooCmp);
        world.add(entity2, FooCmp).add(entity2, BarCmp);

        expect(world.testPool(pool, entity1)).toBeTruthy();
        expect(world.testPool(pool, entity2)).toBeFalsy();
    });

    describe('event', () => {
        let emit: jest.SpyInstance;
        let entity: Entity;
        let pool: EntityPool;

        beforeEach(() => {
            pool = world.pool();
            entity = world.spawn();
            emit = jest.spyOn(pool, 'emit');
        });

        it('should emit "add" when an entity is added', () => {
            pool.add(entity);

            expect(emit).toHaveBeenCalledWith('add', entity);
        });

        it('should emit "remove" when an entity is removed', () => {
            pool.add(entity).remove(entity);

            expect(emit).toHaveBeenCalledWith('remove', entity);
        });

        it('should emit "clear" when the pool is cleared', () => {
           pool.clear();

           expect(emit).toHaveBeenCalledWith('clear');
        });
    });
});
