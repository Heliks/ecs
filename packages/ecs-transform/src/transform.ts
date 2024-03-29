/** Simple 2D vector type. */
interface Vec2 {
  x: number;
  y: number;
}

/**
 * Gives an entity a position and rotation.
 *
 * All units for positions are arbitrary and depend on the local game implementation.
 *
 * Positions are split into a "local" and a "world" position, where the world position
 * is the absolute position that the entity occupies in the world space. The local
 * position is the position relative to its {@link Parent parent}.
 */
export class Transform {

  /** Position relative to its parent (if it has one). */
  public readonly local: Vec2 = { x: 0, y: 0 };

  /** Position in the game world. */
  public readonly world: Vec2 = { x: 0, y: 0 };

  /**
   * @param x (optional) World x position. Default `0`.
   * @param y (optional) World y position. Default `0`.
   * @param rotation (optional) Rotation in radians. Default `0`.
   * @param lx (optional) Local x position relative to its parent. Default `0`.
   * @param ly (optional) Local y position relative to its parent. Default `0`.
   */
  constructor(x = 0, y = 0, public rotation = 0, lx = 0, ly = 0) {
    this.world.x = x;
    this.world.y = y;
    this.local.x = lx;
    this.local.y = ly;
  }

  /** Returns a copy of this transform. */
  public clone(): Transform {
    return new Transform(
      this.world.x,
      this.world.y,
      this.rotation
    );
  }

  /** Rotates the transform so that it points towards an observed world `point`. */
  public lookAt(target: Vec2): this {
    this.rotation = Math.atan2(target.y - this.world.y, target.x - this.world.x);

    return this;
  }

  /**
   * Calculates a euclidean vector (= direction vector) based on the current
   * transform {@link rotation}.
   */
  public getDirection(out: Vec2 = { x: 0, y: 0}): Vec2 {
    out.x = Math.sin(this.rotation);
    out.y = Math.cos(this.rotation);

    return out;
  }

}

