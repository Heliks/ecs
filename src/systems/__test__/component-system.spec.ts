import { createEntityManager, TestComp1 } from '../../__test__/shared';
import { ComponentSystem } from '../component-system';
import { ComponentMapper } from '../../component-mapper';
import { EntityManager } from '../../entity-manager';

class TestSystem extends ComponentSystem<TestComp1> {

    public readonly processSpy = jest.fn();

    getMapper(): ComponentMapper<TestComp1> {
        return this.componentMapper!;
    }

    getComponentType() {
        return TestComp1;
    }

    protected process(component: TestComp1, deltaTime: number): void {
        this.processSpy(component, deltaTime);
    }

}

describe('ComponentSystem', () => {
    let entityManager: EntityManager;
    let system: TestSystem;

    beforeEach(() => {
        entityManager = createEntityManager();

        system = new TestSystem();
        system.boot(entityManager);
    });

    it('should register the correct component mapper', () => {
        expect(system.getMapper().component).toBe(TestComp1);
    });

    it('should process all instances of the systems component', () => {
        system.update(0);

        expect(system.processSpy).toHaveBeenCalledTimes(10);
    });
});
