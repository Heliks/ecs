import BaseSystem from '../systems/base-system';
import World from '../world';

class FooSystem extends BaseSystem {

    // Mock boot
    boot = jest.fn();

    // Mock run
    run = jest.fn();

}

describe('World', () => {
    let system: FooSystem;
    let world: World;

    beforeEach(() => {
        system = new FooSystem();
        world = new World().addSystem(system);
    });

    it('should boot systems', () => {
        expect(system.boot).toHaveBeenCalledTimes(1);
    });

    it('should update systems', () => {
        world.update(0);

        expect(system.run).toHaveBeenCalledWith(0);
    });
});