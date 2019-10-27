import { World } from '../world';
import { System, SystemData, SystemManager, SystemWrapper } from '../system';

// Test manager.
class SystemManagerMock extends SystemManager {

    /** @hidden */
    public getWrapper(system: System): SystemWrapper {
        const wrapper = this.systems.find(item => item.system === system);

        if (! wrapper) {
            throw new Error('Wrapper not found.');
        }

        return wrapper;
    }

    /** Returns the entity pool assigned to the given system. */
    public getPool(system: System) {
        return this.getWrapper(system).entities;
    }

    /** Returns the storages that are assigned to the given system. */
    public getStorages(system: System) {
        return this.getWrapper(system).storages;
    }

}

// Test system.
@SystemData()
class SystemMock implements System {
    boot   = jest.fn();
    update = jest.fn();
}

// Test components.
class A {}
class B {}
class C {}

describe('SystemManager', () => {

    const query = {
        contains: [A, B]
    };

    let world: World;
    let manager: SystemManagerMock;

    beforeEach(() => {
        world = new World();
        manager = new SystemManagerMock(world);
    });

    it('should call boot() when a system is added', () => {
        const system = new SystemMock();

        manager.add(system);

        expect(system.boot).toHaveBeenCalledWith(world);
    });

    it('should ensure that systems are decorated with @SystemData', () => {
        class Foo implements System {
            update = jest.fn();
        }

        // Also test false positives by making sure that systems
        // that do have the decorator are not failing.
        @SystemData()
        class Bar extends Foo {}

        expect(() => manager.add(new Foo())).toThrow();
        expect(() => manager.add(new Bar())).not.toThrow();
    });

    it('should assign entity pools to systems', () => {
        @SystemData({
            query
        })
        class Sys extends SystemMock {}

        const system = new Sys();
        const pool = manager.add(system)
            .getPool(system);

        // The pool that was assigned to the system should be created
        // from the same query.
        const filter = world.createFilter(query);

        expect(pool.filter.equals(filter)).toBeTruthy();
    });

    it('should automatically map system storages if no mapping was provided', () => {
        @SystemData({
            query
        })
        class Sys extends SystemMock {}

        const system = new Sys();
        const storages = manager.add(system)
            .getStorages(system);

        expect(storages[0].type).toBe(A);
        expect(storages[1].type).toBe(B);
    });

    it('should map system storages', () => {
        @SystemData({
            query,
            storages: [C, B]
        })
        class Sys extends SystemMock {}

        const system = new Sys();
        const storages = manager.add(system)
            .getStorages(system);

        expect(storages[0].type).toBe(C);
        expect(storages[1].type).toBe(B);
    });
});
