import ComponentMapper from '../component-mapper';
import { injectMapper } from '../decorators';
import BaseSystem from '../systems/base-system';
import World from '../world';
import { FooBar } from './shared';

class FooSystem extends BaseSystem {

    @injectMapper(FooBar)
    public fooMapper!: ComponentMapper<FooBar>;

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

    it('should inject component mappers when a system is added.', () => {
        const entity = world.create();

        expect(system.fooMapper).toBeInstanceOf(ComponentMapper);
        expect(system.fooMapper.create(entity)).toBeInstanceOf(FooBar);
    });
});