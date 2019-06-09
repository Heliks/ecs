import ComponentMapper from "../component-mapper";
import { Entity } from '../types';
import { FooBar } from './shared';

describe('ComponentMapper', () => {
    let entity: Entity;
    let mapper: ComponentMapper<FooBar>;

    beforeEach(() => {
        entity = Symbol();
        mapper = new ComponentMapper(FooBar);
    });

    it('should add components', () => {
        const component = mapper.create(entity, {
            bar: 'foo',
            foo: 'bar'
        });

        expect(component.bar).toBe('foo');
        expect(component.foo).toBe('bar');
    });
});