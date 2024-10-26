import { World } from '../world';
import { SystemDispatcher } from '../system-dispatcher';


describe('SystemDispatcher', () => {
  let dispatcher: SystemDispatcher;
  let world: World;

  beforeEach(() => {
    dispatcher = new SystemDispatcher();
    world = new World();
  });

  it('should boot schedules', () => {
    const schedule = dispatcher.add('foo');

    schedule.boot = jest.fn();

    dispatcher.boot(world);

    expect(schedule.boot).toHaveBeenCalledWith(world);
  });

  it('should update schedules', () => {
    const schedule = dispatcher.add('foo');

    schedule.update = jest.fn();

    dispatcher.update(world);

    expect(schedule.update).toHaveBeenCalledWith(world);
  });

  it('should insert a schedule before another', () => {
    const id1 = 1;
    const id2 = 2;

    dispatcher.add(id2);
    dispatcher.before(id1, id2);

    const index = dispatcher.getIndex(id1);

    expect(index).toBe(0);
  });

  it('should insert a schedule after another', () => {
    const id1 = 1;
    const id2 = 2;
    const id3 = 2;

    dispatcher.add(id1);
    dispatcher.add(id3);
    dispatcher.after(id2, id1);

    const index = dispatcher.getIndex(id2);

    expect(index).toBe(1);
  });

  describe('add()', () => {
    it('should add a new schedule', () => {
      const schedule = 1;

      dispatcher.add(schedule);

      const index = dispatcher.getIndex(schedule);

      expect(index).toBe(0);
    });

    it('should throw when schedule ID is not unique', () => {
      expect(() => {
        dispatcher.add(1);
        dispatcher.add(1);
      }).toThrow()
    });
  });
});
