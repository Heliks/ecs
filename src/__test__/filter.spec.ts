import { Filter } from '../filter';
import { World } from '../world';
import { BarCmp, FooCmp } from './shared';

describe('Filter', () => {
    const world = new World();

    it('should match identities that satisfy the inclusion set', () => {
        const filter = world.createFilter({
            contains: [FooCmp, BarCmp]
        });

        const identity1 = world.createCompositionId([FooCmp, BarCmp]);
        const identity2 = world.createCompositionId([FooCmp]);

        expect(filter.test(identity1)).toBeTruthy();
        expect(filter.test(identity2)).toBeFalsy();
    });

    it('should match identities that satisfy the exclusion set', () => {
        const filter = world.createFilter({
            contains: [FooCmp],
            excludes: [BarCmp]
        });

        const identity1 = world.createCompositionId([FooCmp]);
        const identity2 = world.createCompositionId([FooCmp, BarCmp]);

        expect(filter.test(identity1)).toBeTruthy();
        expect(filter.test(identity2)).toBeFalsy();
    });
});
