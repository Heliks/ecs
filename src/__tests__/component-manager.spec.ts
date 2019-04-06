import ComponentManager from "../component-manager";
import ComponentMapper from "../component-mapper";
import { createEntity, TestComp1, TestComp2, TestComp3, TestComp4 } from './shared';

describe('ComponentManager', () => {
    let componentMgr: ComponentManager;

    beforeEach(() => {
        componentMgr = new ComponentManager();
    });

    it('should dynamically create new component mappers', () => {
        const mapper = componentMgr.mapper(TestComp1);

        expect(mapper).toBeInstanceOf(ComponentMapper);
        expect(mapper.id).toBe(0);
    });

    it('should add components to an entity', () => {
        const entity = createEntity();

        componentMgr.addComponent(entity, TestComp1);

        expect(componentMgr.hasComponent(entity, TestComp1)).toBeTruthy();
    });

    it('should add components with a constructor type', () => {
        class NameComponent {
            constructor(
                public firstName: string,
                public lastName: string
            ) {}
        }

        const entity = createEntity();

        const component = componentMgr.addComponent(
            entity,
            NameComponent,
            'foo',
            'bar'
        );

        expect(component.firstName).toBe('foo');
        expect(component.lastName).toBe('bar');
    });

    it('should remove components from an entity', () => {
        const entity = createEntity();

        // add component and remove it again
        componentMgr.addComponent(entity, TestComp2);
        componentMgr.removeComponent(entity, TestComp2);

        const check = componentMgr.hasComponent(entity, TestComp2);

        expect(check).toBeFalsy();
    });

    it('should update the composition of an entity', () => {
        const entity = createEntity();

        componentMgr.addComponent(entity, TestComp1);
        componentMgr.addComponent(entity, TestComp2);
        componentMgr.addComponent(entity, TestComp3);

        componentMgr.removeComponent(entity, TestComp3);

        const composition = componentMgr.getComposition(entity);

        expect(composition.get(componentMgr.mapper(TestComp1).id)).toBeTruthy();
        expect(composition.get(componentMgr.mapper(TestComp2).id)).toBeTruthy();
        expect(composition.get(componentMgr.mapper(TestComp3).id)).toBeFalsy();
    });

    it('should compare composition masks with entity compositions', () => {
        const entity = createEntity();

        componentMgr.addComponent(entity, TestComp2);
        componentMgr.addComponent(entity, TestComp3);
        componentMgr.addComponent(entity, TestComp4);

        // build masks with which we can compare the entities composition
        const testMask1 = createEntity();
        const testMask2 = createEntity();

        componentMgr.addComponent(testMask1, TestComp2);
        componentMgr.addComponent(testMask1, TestComp4);

        componentMgr.addComponent(testMask2, TestComp1);
        componentMgr.addComponent(testMask2, TestComp3);

        const composition1 = componentMgr.getComposition(testMask1);
        const composition2 = componentMgr.getComposition(testMask2);

        expect(componentMgr.matchesEntityComposition(entity, composition1)).toBeTruthy();
        expect(componentMgr.matchesEntityComposition(entity, composition2)).toBeFalsy();
    });
});