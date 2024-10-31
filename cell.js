/**
 *
 * @param {Object} (optional) position, velocity, diameter properties
 */
class Cell {
  constructor({ position, velocity, diameter, life, type }) {
    if (position === undefined) {
      // if it wasn't passed in
      // create default vector
      this._position = createVector(0, 0, 0);
    } else this._position = position; // use object property passed in

    if (velocity === undefined) {
      // if it wasn't passed in
      this._velocity = createVector(0, 0, 0);
    } else this._velocity = velocity;

    if (diameter === undefined) {
      // if it wasn't passed in
      this._diameter = 1;
    } else this._diameter = diameter;

    if (life === undefined) {
      // if it wasn't passed in
      this._life = 100;
    } else this._life = life;

    if (position === undefined) {
      // if it wasn't passed in
      // create default vector
      this._position = createVector(0, 0, 0);
    } else this._position = position; // use object property passed in

    this._type = type;

    // print these out for debugging:
    console.log("position:" + position);
    console.log("velocity:" + velocity);
    this._acceleration = createVector(0, 0, 0);

    /**
     *
     * @param {p5.Vector, Array, or Number} force Force (3D) to apply to this object.
     */
    this.applyForce = function (force) {
      if (force !== undefined) {
        this._acceleration.add(force);
      }
    };

    /**
     * Internal use only. Apply current acceleration.
     */
    this._accelerate = function () {
      this._velocity.add(this._acceleration);
      this._acceleration.mult(0); // remove acceleration
    };

    /**
     * This function actually updates the position by accelerating and applying the velocity.
     * @param {Number} friction An optional amount of friction to slow this down by, default is none (0)
     */
    this.update = function (friction = 0) {
      this._accelerate();
      // 2. add the velocity to the position to "move" the cell
      this._position.add(this._velocity);
      //       Cells age (i.e. lose life) over time. When they are out of life, they should be removed from the simulation (and cells array).
      // In the Cell class update() function, decrease the cell’s _life property by 1 every time update() is run. To be complete, try to make sure that it never gets to be less than 0 because how dead can a poor cell be?
      if (this._life > 0) {
        // if life is greater than 0
        this._life--; // decrease life by 1
        console.log(this._life); // print life to console
      }
    };

    /**
     * Set position safely.
     */
    this.setPosition = function (position) {
      this._position = position;
    };

    /**
     * Get position safely.
     */
    this.getPosition = function () {
      // get position
      return this._position;
    };

    this.setDiameter = function (diameter) {
      // set diameter
      this._diameter = diameter;
    };
    this.getDiameter = function () {
      // get diameter
      return this._diameter;
    };

    this.setVelocity = function (velocity) {
      // set velocity
      this._velocity = velocity;
    };
    this.getVelocity = function () {
      // get velocity
      return this._velocity;
    };
    this.getLife = function () {
      // get life
      return this._life;
    };

    this.getType = function () {
      // get type
      return this._type;
    };

    /**
     * ------------------------------------------------------------------
     * @param {p5.Vector} worldCenterPos centre coordinate of world as a p5.Vector
     * @param {Number} worldDiameter diameter of world as a number
     */
    this.constrainToSphere = function (worldCenterPos, worldDiameter) {
      if (this._position.dist(worldCenterPos) > worldDiameter / 2) {
        // find point on world sphere in direction of (this._position - worldCenterPos)
        let positionDirection = p5.Vector.sub(
          this._position,
          worldCenterPos
        ).normalize();

        // new magnitude is inside world sphere accounting for this cell's radius
        let newMagnitude = worldDiameter / 2 - this._diameter;
        this._position = p5.Vector.mult(positionDirection, newMagnitude); // position is magnitude * direction

        this._velocity = positionDirection.mult(-this._velocity.mag() * 0.5); // opposite direction, slower!

        // this.applyForce(positionDirection.mult(-1.2 * this._velocity.mag())); // opposite direction, slower!
      }
    };
  }
}
