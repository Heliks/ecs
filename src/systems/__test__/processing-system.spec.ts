import { contains } from '../../decorators';
import { createEntityManager, TestComp1 } from '../../__test__/shared';
import { ProcessingSystem } from '../processing-system';
import { EntityPool } from '../../entity-pool';
import { Entity } from '../../types';
import { EntityManager } from '../../entity-manager';

@contains(TestComp1)
class TestSystem extends ProcessingSystem {

    public readonly processSpy = jest.fn();

    getPool(): EntityPool {
        return this.entityPool;
    }

    protected process(entity: Entity, deltaTime: number): void {
        this.processSpy(entity, deltaTime);
    }

}

describe('ProcessingSystem', () => {
    let entityManager: EntityManager;
    let system: TestSystem;

    beforeEach(() => {
        entityManager = createEntityManager();

        system = new TestSystem();
        system.boot(entityManager);

        system = new TestSystem();
        system.boot(entityManager);
    });

    it('should have pooled entities', () => {
        expect(system.getPool().size).toBe(10);
    });

    it('should process entities during update()', () => {
        system.update(0);
        expect(system.processSpy).toHaveBeenCalledTimes(10);
    });
});