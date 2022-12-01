import { BitVec } from '../common';
import { COMPONENT_TYPE_LIMIT } from './component';


/**
 * Bit-vector that contains a {@link ComponentId} for every unique component type that
 * is attached to an entity. Internally, the entity system will store a composition for
 * every entity that is currently alive.
 *
 * This means that if a component ID is removed from the composition, it effectively
 * removes ownership of that component type, even if an instance of that type is still
 * stored somewhere else.
 */
export class Composition extends BitVec {

  constructor() {
    super(COMPONENT_TYPE_LIMIT);
  }

}
