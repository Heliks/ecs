import { TestComp1, TestComp2, TestComp3 } from './shared';
import { ComponentManager } from '../component-manager';
import { Filter } from '../filter';

describe('Filter', () => {
    const cm = new ComponentManager();

    it('should match identities that satisfy the inclusion set', () => {
        const filter = new Filter(cm.createCompositionId([
            TestComp1,
            TestComp3
        ]));

        const identity1 = cm.createCompositionId([ TestComp1, TestComp3 ]);
        const identity2 = cm.createCompositionId([ TestComp1, TestComp2, TestComp3 ]);
        const identity3 = cm.createCompositionId([ TestComp2 ]);
        const identity4 = cm.createCompositionId([ TestComp1, TestComp2 ]);

        expect(filter.check(identity1)).toBeTruthy();
        expect(filter.check(identity2)).toBeTruthy();
        expect(filter.check(identity3)).toBeFalsy();
        expect(filter.check(identity4)).toBeFalsy();
    });

    it('should match identities that satisfy the exclusion set', () => {
        const filter = new Filter(
            cm.createCompositionId([ TestComp1 ]),
            cm.createCompositionId([ TestComp2, TestComp3 ])
        );

        const identity1 = cm.createCompositionId([ TestComp1 ]);
        const identity2 = cm.createCompositionId([ TestComp1, TestComp3 ]);
        const identity3 = cm.createCompositionId([ TestComp1, TestComp2, TestComp3 ]);

        expect(filter.check(identity1)).toBeTruthy();
        expect(filter.check(identity2)).toBeFalsy();
        expect(filter.check(identity3)).toBeFalsy();
    });

});