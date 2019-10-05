import { BitSet } from '../bit-set';
import { EntityManager } from '../entity-manager';
import { EntityPool } from '../entity-pool';
import { Filter } from '../filter';
import { World } from '../world';

describe('EntityManager', () => {
   let entities: EntityManager;
   let filter: Filter;
   let world: World;

   class A {}
   class B {}
   class C {}
   class D {}

   beforeEach(() => {
      world = new World();
      entities = world.entities;
   });

   it('should create a composition bit set', () => {
      expect(entities.composition(entities.add())).toBeInstanceOf(BitSet);
   });

   it('should register entity pools', () => {
      const pool = entities.registerPool(filter);
   });

   describe('sync()', () => {
      let pool: EntityPool;

      const filter = world.createFilter({
         contains: [A, C],
         excludes: [B]
      });
      
      beforeEach(() => {
         pool = entities.registerPool(filter);
      });

      it('should add entities to pools', () => {
         // Eligible
         const e1 = world.create([A, C]);
         const e2 = world.create([A, C, D]);

         // Not eligible
         const e3 = world.create([A, B, C]);
         const e4 = world.create([A, B]);

         world.entities.sync();

         expect(pool.has(e1)).toBeTruthy();
         expect(pool.has(e2)).toBeTruthy();
         expect(pool.has(e3)).toBeFalsy();
         expect(pool.has(e4)).toBeFalsy();
      });

      it('should remove entities from pools', () => {
         const e1 = world.create([A, C]);

         world.entities


      });
   });

   it('should synchronize entity pools', () => {


      const pool = entities.registerPool(filter);


   });

});
