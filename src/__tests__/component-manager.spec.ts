import ComponentManager from "../component-manager";
import ComponentMapper from "../component-mapper";
import { em, TestComp1, TestComp2, TestComp3, TestComp4 } from "./shared";

describe('ComponentManager', () => {
    const cm = new ComponentManager();

    it('should dynamically create new component mappers', () => {
        const mapper1 = cm.mapper(TestComp1);
        const mapper2 = cm.mapper(TestComp2);

        expect(mapper1).toBeInstanceOf(ComponentMapper);
        expect(mapper2).toBeInstanceOf(ComponentMapper);

        expect(mapper1.id).toBe(0);
        expect(mapper2.id).toBe(1);
    });

    it('should add components to an entity', () => {
        const entity1 = em.create();
        const entity2 = em.create();

        cm.addComponent(entity1, TestComp1);
        cm.addComponent(entity1, TestComp2);
        cm.addComponent(entity2, TestComp2);

        expect(cm.hasComponent(entity1, TestComp1)).toBeTruthy();
        expect(cm.hasComponent(entity1, TestComp2)).toBeTruthy();
        expect(cm.hasComponent(entity2, TestComp1)).toBeFalsy();
        expect(cm.hasComponent(entity2, TestComp2)).toBeTruthy();
    });

    it('should add components with a constructor type', () => {
        class NameComponent {
            constructor(
                public first: string,
                public last: string
            ) {}
        }

        const entity = em.create();

        const name = cm.addComponent(entity, NameComponent, 'foo', 'bar');

        expect(name.first).toBe('foo');
        expect(name.last).toBe('bar');
    });

    it('should remove components from an entity', () => {
        const entity = em.create();

        cm.addComponent(entity, TestComp1);
        cm.addComponent(entity, TestComp2);
        cm.addComponent(entity, TestComp3);

        cm.removeComponent(entity, TestComp2);

        expect(cm.hasComponent(entity, TestComp1)).toBeTruthy();
        expect(cm.hasComponent(entity, TestComp2)).toBeFalsy();
        expect(cm.hasComponent(entity, TestComp3)).toBeTruthy();
    });

    it('should add/remove composition flags of an entities composition id', () => {
        const entity = em.create();

        cm.addComponent(entity, TestComp1);
        cm.addComponent(entity, TestComp2);
        cm.addComponent(entity, TestComp3);

        cm.removeComponent(entity, TestComp3);

        expect(cm.compositionId(entity).get(cm.mapper(TestComp1).id)).toBeTruthy();
        expect(cm.compositionId(entity).get(cm.mapper(TestComp2).id)).toBeTruthy();
        expect(cm.compositionId(entity).get(cm.mapper(TestComp3).id)).toBeFalsy();
    });

    it('should match other composition ids if they contain the same components', () => {
        const entity = em.create();

        const testMask1 = em.create();
        const testMask2 = em.create();

        cm.addComponent(entity, TestComp2);
        cm.addComponent(entity, TestComp3);
        cm.addComponent(entity, TestComp4);

        cm.addComponent(testMask1, TestComp2);
        cm.addComponent(testMask1, TestComp4);

        cm.addComponent(testMask2, TestComp1);
        cm.addComponent(testMask2, TestComp3);

        expect(cm.matchesEntityComposition(entity, cm.compositionId(testMask1))).toBeTruthy();
        expect(cm.matchesEntityComposition(entity, cm.compositionId(testMask2))).toBeFalsy();
    });
});
