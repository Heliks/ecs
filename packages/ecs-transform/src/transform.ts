/** Simple 2D vector. */
type Vec2 = [number, number];

/** Component that can be attached to an entity to give it a position and rotation. */
export class Transform {

  /** Position relative to the parent of this transform. */
  public readonly local: Vec2 = [0, 0];

  /** Absolute position in the world. */
  public readonly world: Vec2 = [0, 0];

  /** Contains `true` if the [[local]] coordinates of this component were updated. */
  public isLocalDirty = true;

  /** @deprecated */
  public get x(): number {
    return this.world[0];
  }

  /** @deprecated */
  public get y(): number {
    return this.world[1];
  }

  /**
   * @param x Position on the x axis relative to the parent of the entity that has this
   *  component (if it exists). This can be any unit depending on the renderer or physics
   *  engine, but in most cases it will be meters.
   * @param y Position on the y axis relative to the parent of the entity that has this
   *  component (if it exists). Like [[x]] this can be any unit.
   * @param rotation Rotation in radians.
   */
  constructor(x = 0, y = 0, public rotation = 0) {
    this.world[0] = x;
    this.world[1] = y;
  }

  public setPosition(x: number, y: number): this {
    this.local[0] = x;
    this.local[1] = y;

    this.isLocalDirty = true;

    return this;
  }

  /** Returns a copy of this transform. */
  public clone(): Transform {
    return new Transform(
      this.world[0],
      this.world[0],
      this.rotation
    );
  }

}

