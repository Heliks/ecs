import ComponentMapper from "../component-mapper";
import { em, TestComp1 } from "./shared";

describe('ComponentMapper', () => {
    const positionMapper = new ComponentMapper(0, TestComp1);

    it('should create a new mapper', () => {
        expect(positionMapper.create(em.create())).toBeInstanceOf(TestComp1);
    });

    it('should store a component instance for an entity', () => {
        const entity = em.create();

        positionMapper.create(entity);

        expect(positionMapper.get(entity)).toBeInstanceOf(TestComp1);
    });
});