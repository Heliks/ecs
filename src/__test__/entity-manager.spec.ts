import EntityManager from '../entity-manager';
import { TestComp1, TestComp2 } from "./shared";

describe('EntityManager', () => {
    let manager: EntityManager;

    beforeEach(() => {
        manager = new EntityManager();
    });

    it('should create entities', () => {
        expect(typeof manager.create()).toBe('symbol');
    });

    it('should destroy an entity', () => {
        const entity = manager.create();

        manager.destroy(entity);

        expect(manager.exists(entity)).toBeFalsy();
    });

    it('should reset the composition of destroyed entities', () => {
        const entity = manager.create([
            TestComp1,
            TestComp2
        ]);

        // destroy entity and get composition
        manager.destroy(entity);

        expect(manager.componentManager.getCompositionId(entity).isEmpty()).toBeTruthy();
    });

    it('should synchronize pools', () => {
        const pool1 = manager.registerPool({ contains: [ TestComp1 ] });
        const pool2 = manager.registerPool({ contains: [ TestComp2 ] });

        const entity1 = manager.create([ TestComp1 ]);
        const entity2 = manager.create([ TestComp2 ]);

        manager.synchronize();

        // validate size
        expect(pool1.size).toBe(1);
        expect(pool2.size).toBe(1);

        // validate membership
        expect(pool1.has(entity1)).toBeTruthy();
        expect(pool2.has(entity2)).toBeTruthy();
    });
});