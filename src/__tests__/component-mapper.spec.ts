import ComponentMapper from "../component-mapper";
import { createEntity, em, TestComp1 } from './shared';

describe('ComponentMapper', () => {
    let mapper: ComponentMapper<TestComp1>;

    beforeEach(() => {
        mapper = new ComponentMapper(0, TestComp1);
    });

    it('should add the mapped component to an entity', () => {
        const entity = createEntity();

        mapper.create(entity);

        expect(mapper.get(entity)).toBeInstanceOf(TestComp1);
    });
});