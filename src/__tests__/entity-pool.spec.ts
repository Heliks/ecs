import EntityPool from "../entity-pool";
import { ENTITY_EVENT_ADD, ENTITY_EVENT_REMOVE } from '../types';
import { em, TestComp1, TestComp2, TestComp3 } from "./shared";

describe('EntityPool', () => {
    it('should validate if an entity is eligible to join', () => {
        const pool = new EntityPool(em.createFilter({
            contains: [ TestComp3 ],
            excludes: [ TestComp2 ]
        }));

        const entity1 = em.create();
        const entity2 = em.create();

        em.componentManager.addComponent(entity1, TestComp1);
        em.componentManager.addComponent(entity1, TestComp3);

        em.componentManager.addComponent(entity2, TestComp2);
        em.componentManager.addComponent(entity2, TestComp3);

        expect(pool.check(em.componentManager.getComposition(entity1))).toBeTruthy();
        expect(pool.check(em.componentManager.getComposition(entity2))).toBeFalsy();
    });

    it('should emit an event when an entity is added / removed', async () => {
        const pool = new EntityPool(em.createFilter({}));
        const entity = em.create();

        const onAddEntity = new Promise(resolve => {
            pool.on(ENTITY_EVENT_ADD, added => {
                expect(added).toBe(entity);

                resolve();
            });
        });

        const onRemoveEntity = new Promise(resolve => {
            pool.on(ENTITY_EVENT_REMOVE, removed => {
                expect(removed).toBe(entity);

                resolve();
            });
        });

        pool.add(entity);
        pool.remove(entity);

        return Promise.all([
            onAddEntity,
            onRemoveEntity
        ]);
    });

});
