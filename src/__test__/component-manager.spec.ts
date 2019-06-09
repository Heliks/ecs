import ComponentManager from "../component-manager";
import ComponentMapper from "../component-mapper";
import { Entity } from '../types';
import { createEntity, FooBar, TestComp1, TestComp2, TestComp3, TestComp4 } from './shared';

describe('ComponentManager', () => {
    let entity: Entity;
    let manager: ComponentManager;

    beforeEach(() => {
        entity = Symbol();
        manager = new ComponentManager();
    });

    it('should return component mappers', () => {
        expect(manager.mapper(FooBar).id).toBe(0);
    });

    it('should add components to an entity', () => {
        const success = manager
            .add(entity, FooBar)
            .has(entity, FooBar);

        expect(success).toBeTruthy();
    });

    it('should add many components to an entity', () => {
        const composition = manager
            .addMany(entity, [ TestComp2, TestComp4 ])
            .getCompositionId(entity);

        expect(composition.get(manager.mapper(TestComp2).id)).toBeTruthy();
        expect(composition.get(manager.mapper(TestComp4).id)).toBeTruthy();
    });

    it('should remove components from an entity', () => {
        const success = manager
            .add(entity, FooBar)
            .remove(entity, FooBar)
            .has(entity, FooBar);

        expect(success).toBeFalsy();
    });

    it('should update the composition of an entity', () => {
        const composition = manager
            .add(entity, TestComp1)
            .add(entity, TestComp2)
            .add(entity, TestComp3)
            .remove(entity, TestComp3)
            .getCompositionId(entity);

        expect(composition.get(manager.mapper(TestComp1).id)).toBeTruthy();
        expect(composition.get(manager.mapper(TestComp2).id)).toBeTruthy();
        expect(composition.get(manager.mapper(TestComp3).id)).toBeFalsy();
    });

    it('should compare composition masks with entity compositions', () => {
        manager.addMany(entity, [ TestComp2, TestComp3, TestComp4 ]);

        // build masks with which we can compare the entities composition
        const maskEntity1 = Symbol();
        const maskEntity2 = Symbol();

        manager
            .addMany(maskEntity1, [ TestComp2, TestComp4 ])
            .addMany(maskEntity2, [ TestComp1, TestComp3 ]);

        const composition1 = manager.getCompositionId(maskEntity1);
        const composition2 = manager.getCompositionId(maskEntity2);

        expect(manager.matchesEntityComposition(entity, composition1)).toBeTruthy();
        expect(manager.matchesEntityComposition(entity, composition2)).toBeFalsy();
    });
});