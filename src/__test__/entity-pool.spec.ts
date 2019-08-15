import EntityPool from "../entity-pool";
import { em, TestComp1, TestComp2, TestComp3 } from "./shared";

describe('EntityPool', () => {
    it('should validate if an entity is eligible to join', () => {
        const pool = new EntityPool(em.createFilter({
            contains: [ TestComp3 ],
            excludes: [ TestComp2 ]
        }));

        const entity1 = em.create();
        const entity2 = em.create();

        em.componentManager.add(entity1, TestComp1);
        em.componentManager.add(entity1, TestComp3);

        em.componentManager.add(entity2, TestComp2);
        em.componentManager.add(entity2, TestComp3);

        expect(pool.check(em.componentManager.getCompositionId(entity1))).toBeTruthy();
        expect(pool.check(em.componentManager.getCompositionId(entity2))).toBeFalsy();
    });

    describe('events', () => {
        let emit: jest.SpyInstance;
        let pool: EntityPool;

        beforeEach(() => {
            pool = new EntityPool(em.createFilter());
            emit = jest.spyOn(pool, 'emit');
        });

        it('should emit "add" when an entity is added', () => {
            const entity = em.create();

            pool.add(entity);

            expect(emit).toHaveBeenCalledWith('add', entity);
        });

        it('should emit "remove" when an entity is removed', () => {
            const entity = em.create();

            pool.add(entity).remove(entity);

            expect(emit).toHaveBeenCalledWith('remove', entity);
        });

        it('should emit "clear" when the pool is cleared', () => {
           pool.clear();

           expect(emit).toHaveBeenCalledWith('clear');
        });
    });
});
