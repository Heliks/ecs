import World from '../world';
import { TestComp1, TestComp2, TestSystem } from './shared';

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

    it('should map an array of components to their respective mappers', () => {
        const [ mapper1, mapper2 ] = world.getMappers(TestComp1, TestComp2);

        expect(mapper1.isComponentInstance(new TestComp1())).toBeTruthy();
        expect(mapper2.isComponentInstance(new TestComp2())).toBeTruthy();
    });
});