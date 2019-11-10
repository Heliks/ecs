import { World } from '../world';
import { InjectStorage, System, SystemData, SystemManager, SystemWrapper } from '../system';
import { Storage } from '../storage';

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

    /** Returns the entity group assigned to the given system. */
    public getGroup(system: System) {
        return this.getWrapper(system).entities;
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

    it('should assign an entity group to an added system', () => {
        @SystemData({
            query
        })
        class Sys extends SystemMock {}

        const system = new Sys();
        const group = manager.add(system)
            .getGroup(system);

        // The group that was assigned to the system should be created
        // from the same query.
        const filter = world.createFilter(query);

        expect(group.filter.equals(filter)).toBeTruthy();
    });

    it('should inject storages', () => {
        @SystemData({
            query
        })
        class Foo extends SystemMock {
            @InjectStorage(A) public a!: Storage<A>;
            @InjectStorage(B) public b!: Storage<B>;
        }

        const system = new Foo();

        // Storages are only injected after the system was added.
        manager.add(system);

        expect(system.a.type).toBe(A);
        expect(system.b.type).toBe(B);
    });

});
