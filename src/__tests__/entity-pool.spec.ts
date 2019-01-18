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

        em.componentManager.addComponent(entity1, TestComp1);
        em.componentManager.addComponent(entity1, TestComp3);

        em.componentManager.addComponent(entity2, TestComp2);
        em.componentManager.addComponent(entity2, TestComp3);

        expect(pool.check(em.componentManager.compositionId(entity1))).toBeTruthy();
        expect(pool.check(em.componentManager.compositionId(entity2))).toBeFalsy();
    });
});