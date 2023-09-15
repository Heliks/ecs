import { Composition } from '../entity';


export class Filter {

  /**
   * @param inclusions Mask with bits that must be present to satisfy this filter.
   * @param exclusions Mask with bits that are not allowed to be present to satisfy this filter.
   */
  constructor(
    public readonly inclusions = new Composition(),
    public readonly exclusions = new Composition()
  ) {}

  /** Returns `true` if the `composition` satisfies this filter. */
  public test(composition: Composition): boolean {
    return composition.contains(this.inclusions) && composition.excludes(this.exclusions);
  }

  /** Returns true if `filter` is equal to this one. */
  public equals(filter: Filter): boolean {
    return this.inclusions.equals(filter.inclusions) && this.exclusions.equals(filter.exclusions);
  }

}
