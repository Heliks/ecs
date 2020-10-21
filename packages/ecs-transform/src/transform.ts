/** Simple 2D vector. */
type Vec2 = {
  x: number;
  y: number;
}

/** Component that can be attached to an entity to give it a position and rotation. */
export class Transform {

  /** Position relative to the parent of this transform. */
  public readonly local: Vec2 = { x: 0, y: 0 };

  /** Absolute position in the world. */
  public readonly world: Vec2 = { x: 0, y: 0 };

  /** Contains `true` if the [[local]] coordinates of this component were updated. */
  public isLocalDirty = true;

  /**
   * @param x Position on the x axis relative to the parent of the entity that has this
   *  component (if it exists). This can be any unit depending on the renderer or physics
   *  engine, but in most cases it will be meters.
   * @param y Position on the y axis relative to the parent of the entity that has this
   *  component (if it exists). Like [[x]] this can be any unit.
   * @param rotation Rotation in radians.
   */
  constructor(x = 0, y = 0, public rotation = 0) {
    this.world.x = x;
    this.world.y = y;
  }

  /** Updates the local `x` and `y` position. */
  public setLocal(x: number, y: number): this {
    this.local.x = x;
    this.local.y = y;

    this.isLocalDirty = true;

    return this;
  }

  /** Returns a copy of this transform. */
  public clone(): Transform {
    return new Transform(this.world.x, this.world.y, this.rotation);
  }

}

