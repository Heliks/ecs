import { Schedule } from '../schedule';
import { TestSystem } from './test-system';
import { World } from '../world';


describe('Schedule', () => {
  let schedule: Schedule;
  let world: World;

  beforeEach(() => {
    schedule = new Schedule('foo');
    world = new World();
  });

  it('should boot systems', () => {
    const sys = new TestSystem();

    schedule.add(sys);
    schedule.boot(world);

    expect(sys.boot).toHaveBeenCalledWith(world);
  });

  it('should update all systems', () => {
    const sys1 = new TestSystem();
    const sys2 = new TestSystem();

    schedule.add(sys1);
    schedule.add(sys2);

    schedule.update(world);

    expect(sys1.update).toHaveBeenCalledWith(world);
    expect(sys2.update).toHaveBeenCalledWith(world);
  });
});
