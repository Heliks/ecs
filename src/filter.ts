import { BitSet } from "bitset/bitset";

export default class Filter {

    /**
     * @param {BitSet} inclusions   bits that must be included
     * @param {BitSet} exclusions   not allowed bits
     */
    constructor(
        readonly inclusions = new BitSet(),
        readonly exclusions = new BitSet()
    ) {}

    /**
     * Returns ``true`` if the compositionId satisfies this filter
     *
     * @param {BitSet} compositionId
     * @returns {boolean}
     */
    check(compositionId: BitSet): boolean {
        return this.inclusions.and(compositionId).equals(this.inclusions)
            && this.exclusions.and(compositionId).isEmpty();
    }

    /**
     * Returns ``true`` if a filter is equal to this one
     *
     * @param {Filter} filter
     * @returns {boolean}
     */
    equals(filter: Filter): boolean {
        return this.inclusions.equals(filter.inclusions)
            && this.exclusions.equals(filter.exclusions);
    }

}