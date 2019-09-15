import { _BITSET, Bitset } from './bitset';

export class Filter {

    /**
     * @param inclusions Bits that must be included to satisfy this filter.
     * @param exclusions If any of these bits is present the filter will not be satisfied.
     */
    constructor(
        public readonly inclusions = new _BITSET(),
        public readonly exclusions = new _BITSET()
    ) {}

    /**
     * Returns true if the given composition id satisfies this filter.
     *
     * @param compositionId The composition id that should be checked.
     * @returns True if the given composition id satisfies this filter.
     */
    public test(compositionId: Bitset): boolean {
        return this.inclusions.and(compositionId).equals(this.inclusions)
            && this.exclusions.and(compositionId).isEmpty();
    }

    /**
     * Returns true if the given filter is equal to this one.
     *
     * @param filter A filter
     * @returns True if the given filter is equal to this one.
     */
    public equals(filter: Filter): boolean {
        return this.inclusions.equals(filter.inclusions)
            && this.exclusions.equals(filter.exclusions);
    }

}
