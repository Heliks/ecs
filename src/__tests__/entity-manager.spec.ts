import EntityManager from "../entity-manager";
import { TestComp1, TestComp2 } from "./shared";

describe('EntityManager', () => {
    let entityManager: EntityManager;

    beforeEach(() => {
        entityManager = new EntityManager();
    });

    it('should store created entities', () => {
        const entity = entityManager.create();

        expect(entityManager.exists(entity)).toBeTruthy();
    });

    it('should sort entities into their matching pools', () => {
        const pool = entityManager.registerPool({
            contains: [ TestComp1 ]
        });

        const entity1 = entityManager.create();
        const entity2 = entityManager.create();

        entityManager.componentManager.addComponent(entity1, TestComp1);
        entityManager.componentManager.addComponent(entity2, TestComp2);

        // run the update phase so pools are synchronized
        entityManager.update();

        expect(pool.has(entity1)).toBeTruthy();
        expect(pool.has(entity2)).toBeFalsy();
    });

    it('should destroy an entity', () => {
        const entity = entityManager.create();

        entityManager.destroy(entity);

        expect(entityManager.exists(entity)).toBeFalsy();
    });

    it('should reset the composition of destroyed entities', () => {
        const entity = entityManager.create();

        entityManager.componentManager.addComponent(entity, TestComp1);
        entityManager.componentManager.addComponent(entity, TestComp2);

        entityManager.destroy(entity);

        const composition = entityManager.componentManager.getComposition(entity);

        expect(composition.isEmpty()).toBeTruthy();
    });
});