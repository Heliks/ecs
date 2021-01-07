/** Simple 2D vector type. */
interface Vec2 {
  x: number;
  y: number;
}

/** 3D Vector type. */
interface Vec3 extends Vec2 {
  z: number;
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

  /** Position relative to the parent of this transform. */
  public readonly local: Vec3 = { x: 0, y: 0, z: 0 };

  /** Absolute position in the world. */
  public readonly world: Vec3 = { x: 0, y: 0, z: 0 };

  /**
   * @param x World position on x axis.
   * @param y World position on y axis.
   * @param z World position on z axis.
   * @param rotation Rotation in radians.
   */
  constructor(x = 0, y = 0, z = 0, public rotation = 0) {
    this.world.x = x;
    this.world.y = y;
    this.world.z = z;
  }

  /** Returns a copy of this transform. */
  public clone(): Transform {
    return new Transform(
      this.world.x,
      this.world.y,
      this.world.z,
      this.rotation
    );
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

