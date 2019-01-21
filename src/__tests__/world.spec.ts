import World from '../world';
import { TestSystem } from './shared';

describe('World', () => {
    const world = new World();

    it('should boot bootable systems', () => {
        const system = new TestSystem();

        world.addSystem(system);

        expect(system.booted).toBeTruthy();
    });

    it('should return a system', () => {
        world.addSystem(new TestSystem());

        expect(world.getSystem(TestSystem).prop).toBe('test');
    });
});