import World from '../world';
import { TestSystem } from './shared';

describe('World', () => {
    let world: World;

    beforeEach(() => {
        world = new World();
    });

    it('should boot bootable systems', () => {
        const system = new TestSystem();

        world.addSystem(system);

        expect(system.booted).toBeTruthy();
    });

    it('should add game system', () => {
        world.addSystem(new TestSystem());

        const prop = world.getSystem(TestSystem).prop;

        expect(prop).toBe('test');
    });
});