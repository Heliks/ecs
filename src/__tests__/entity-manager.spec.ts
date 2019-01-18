import EntityManager from "../entity-manager";
import { TestComp1, TestComp2 } from "./shared";

describe('EntityManager', () => {
    const em = new EntityManager();

    it('should create an entity symbol with description "test"', () => {
        expect(em.create('test').toString()).toBe('Symbol(test)');
    });

    it('should store created entities', () => {
        const initial = em.totalEntities;

        em.create();

        expect(em.totalEntities).toBe(initial + 1);
    });

    it('should synchronize pools', () => {
        const em = new EntityManager();

        const pool = em.registerPool({ contains: [ TestComp1 ] });

        const entity1 = em.create('match');
        const entity2 = em.create('no match 1');
        const entity3 = em.create('no match 2');

        em.componentManager.addComponent(entity1, TestComp1);
        em.componentManager.addComponent(entity2, TestComp2);

        em.componentManager.addComponent(entity3, TestComp1);
        em.componentManager.removeComponent(entity3, TestComp1);

        em.update();

        expect(pool.has(entity1)).toBeTruthy();
        expect(pool.has(entity2)).toBeFalsy();
        expect(pool.has(entity3)).toBeFalsy();
    });
});