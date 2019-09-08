import { World } from '../world';
import { SystemManager } from '../system-manager';
import { System } from '../system';

describe('SystemManager', () => {
    class Foo implements System {

        /** {@see System.update} */
        public update(world: World): void {}

    }

    let manager: SystemManager;
    let world: World;

    beforeEach(() => {
        manager = new SystemManager();
        world = new World();
    });

    it('should update systems.', () => {
        const system = new Foo();
        const update = jest.spyOn(system, 'update');

        manager.add(system).update(world);

        expect(update).toHaveBeenCalledWith(world);
    });
});
