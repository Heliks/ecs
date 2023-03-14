import { System } from '../system';


export class TestSystem implements System {

  /** @inheritDoc */
  boot = jest.fn();

  /** @inheritDoc */
  update = jest.fn();

}
