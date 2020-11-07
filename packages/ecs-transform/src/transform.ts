/** Simple 2D vector type. */
type Vec2 = {
  x: number;
  y: number;
}

/** 90 degrees in radians. */
const DEG90_RAD = 1.5708;

/**
 * Simple transform component to give an entity position and rotation.
 *
 * The position is split into a "local" and a "world" position where the world position
 * represents the absolute coordinates the entity occupies in the world space while the
 * local position is the position relative to the entities parent. The unit of these
 * positions is arbitrary and depends on the implementation of the game engine.
 */
export class Transform {

  /**
   * Position relative to the parent of this transform.
   * Note: Don't update this directly. Use `setLocal()` instead.
   */
  public readonly local: Vec2 = { x: 0, y: 0 };

  /** Absolute position in the world. */
  public readonly world: Vec2 = { x: 0, y: 0 };


  /**
   * @param x World position on x axis.
   * @param y World position on y axis.
   * @param rotation Rotation in radians.
   */
  constructor(x = 0, y = 0, public rotation = 0) {
    this.world.x = x;
    this.world.y = y;
  }

  /**
   * Updates the local `x` and `y` position.
   * Note: This will also re-calculate the world position on the next frame.
   */
  public setLocal(x: number, y: number): this {
    this.local.x = x;
    this.local.y = y;

    return this;
  }

  /** Returns a copy of this transform. */
  public clone(): Transform {
    return new Transform(this.world.x, this.world.y, this.rotation);
  }

  /**
   * Rotates the transform so that it points towards an an observed world `point`. For
   * convenience this assumes a grid where the y axis points downwards.
   */
  public lookAt(target: Vec2): this {
    this.rotation = DEG90_RAD + Math.atan2(
      target.y - this.world.y,
      target.x - this.world.x
    );

    return this;
  }

  /**
   * Calculates an euclidean vector (= direction vector) based on the current rotation
   * and assigns the result to `out`.
   */
  public getDirectionVector(out: Vec2 = { x: 0, y: 0}): Vec2 {
    out.x = Math.sin(this.rotation);
    out.y = Math.cos(this.rotation);

    return out;
  }

}

