import { ClassType } from '../types';
import { World } from '../world';
import { SystemDesc, SystemManager, SystemWrapper } from '../system-manager';
import { System } from '../system';

class SystemManagerMock extends SystemManager {

    public getWrapper(system: System): SystemWrapper {
        const wrapper = this.systems.find(item => item.system === system);

        if (! wrapper) {
            throw new Error('Wrapper not found.');
        }

        return wrapper;
    }

    addAndReturn(system: System): SystemWrapper {
        return this.add(system).getWrapper(system);

    }

}

describe('SystemManager', () => {
    let world: World;
    let systems: SystemManagerMock;

    class SysMock implements System {
        boot   = jest.fn();
        update = jest.fn();
    }

    beforeEach(() => {
        world   = new World();
        systems = new SystemManagerMock(world);
    });

    it('should call boot() when a system is added', () => {
        const system = new SysMock();

        systems.add(system);

        expect(system.boot).toHaveBeenCalledWith(world);
    });

    it('should throw when adding a class that is not a system.', () => {
        expect(() => systems.add(new (class Foo {}) as System)).toThrow();
    });

    describe('add()', () => {
        class A {}
        class B {}
        class C {}

        const query = {
            contains: [A, B]
        };

        it('should pool entities', () => {
            @SystemDesc({ query })
            class Sys extends SysMock {}

            const equals = systems
                .addAndReturn(new Sys())
                .entities
                .filter
                .equals(world.createFilter(query));

            expect(equals).toBeTruthy();
        });

        it('should automatically map storages if no mapping was provided', () => {
            @SystemDesc({ query })
            class Sys extends SysMock {}

            const storages = systems.addAndReturn(new Sys()).storages;

            expect(storages[0].type).toBe(A);
            expect(storages[1].type).toBe(B);
        });

        it('should map storages', () => {
            @SystemDesc({
                query,
                storages: [C, B],
            });
            class Sys extends SysMock {}

            const storages = systems.addAndReturn(new Sys()).storages;

            expect(storages[0].type).toBe(C);
            expect(storages[1].type).toBe(B);
        });
    });

    it('should call update() on all systems', () => {


        /*
        expect(wrapper.entities.filter.equals(
            world.createFilter(query))
        ).toBeTruthy();
`*/






        /*
        const system1 = new TestSystem();
        const system2 = new TestSystem();

        systems.add(system1);
        systems.add(system2);

        systems.update(5);

        expect(system1.update).toHaveBeenCalledWith(world, 5);
        expect(system2.update).toHaveBeenCalledWith(world, 5);
        */

    });
});
