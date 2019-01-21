import ComponentSystem from '../component-system';
import World from '../world';
import { TestComp1, TestComp2 } from './shared';

class TestSystem extends ComponentSystem {

    public component?: TestComp1;

    process(component: TestComp1): void {
        this.component = component;
    }

}

describe('ComponentSystem', () => {
    const world = new World();

    it('should iterate over component instances', () => {
        const system = new TestSystem(TestComp1);

        const entity = world.entityManager.create();
        const component = world.addComponent(entity, TestComp1);

        component.a = 999;

        world.addSystem(system);
        world.update(0);

        expect(system.component).toBe(component);
    });
});