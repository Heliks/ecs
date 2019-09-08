import { Entity } from '../types';
import { ComponentMapper } from '../component-mapper';
import { FooCmp } from './shared';
import { World } from '../world';

describe('ComponentMapper', () => {
    let entity: Entity;
    let mapper: ComponentMapper<FooCmp>;

    beforeEach(() => {
        entity = new World().spawn();
        mapper = new ComponentMapper(FooCmp);
    });

    it('should add components', () => {
        expect(mapper.create(entity)).toBeInstanceOf(FooCmp);
    });

    it('should assign data to new components', () => {
        const component = mapper.create(entity, {
            foo: 'bar'
        });

        expect(component.foo).toBe('bar');
    });
});
