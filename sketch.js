let cells = []; // array of cells objects
let cells2 = [];

function preload() {
  img = loadImage("img/bocchi.png");
}
/**
 * Initialise the cells array with a number of new Cell objects
 *
 * @param {Integer} maxCells Number of cells for the new array
 * @returns {Array} array of new Cells objects
 */
function createCellsArray(maxCells) {
  let cells = [];
  let types = ["plane", "cylinder", "cone", "sphere", "box", "torus"]; // array of shapes
  for (let i = 0; i < maxCells; i++) {
    cells.push(
      new Cell({
        position: p5.Vector.random3D(), // random position
        velocity: p5.Vector.random3D().mult(4), // random velocity
        life: random(600, 1200), // random life
        diameter: 35,
        type: random(types), // random shape
      })
    );
  }
  return cells;
}
function repelCellsArray(maxCells) {
  let cells2 = [];
  for (let i = 0; i < maxCells; i++) {
    cells2.push(
      new Cell({
        position: p5.Vector.random3D().mult(width / 3), // random position
        velocity: p5.Vector.random3D().mult(4), // random velocity
        life: random(60, 120), // random life
        diameter: 35,
        type: "sphere",
      })
    );
  }
  return cells2;
}
/**
 * @param {Array} cellsArray Array of Cell objects to draw
 */
function drawCells3D(cellsArray) {
  for (let cell of cellsArray) {
    if (cellsArray !== cells2 && cells.length > 0) {
      cell.update();
    } else if (cells.length == 0) {
      cells2 = [];
    }

    push();
    translate(cell.getPosition());
    let c = map(cell.getLife(), 0, 100, 0, 255);
    switch (cell.getType()) {
      case "plane": // draw a plane
        plane(cell.getDiameter());
        break;
      case "cylinder": // draw a cylinder
        fill(c, 255 - c, 0);
        cylinder(cell.getDiameter());
        break;
      case "cone": // draw a cone
        fill(c, 255 - c, 0);
        cone(cell.getDiameter());
        break;
      case "sphere": // draw a sphere
        sphere(cell.getDiameter());
        break;
      case "box": // draw a box
        texture(img);
        box(cell.getDiameter());
        break;
      case "torus": // draw a torus
        torus(cell.getDiameter());
    }
    pop();

    // if (cellsArray == cells2) {
    //   cell.update();
    //   push();
    //   translate(cell.getPosition());
    //   sphere(cell.getDiameter());
    //   pop();
    // }
  }
}

/**
 * Check collision between two cells (overlapping positions)
 * @param {Cell} cell1
 * @param {Cell} cell2
 * @returns {Boolean} true if collided otherwise false
 */
function checkCollision(cell1, cell2) {
  let distance = p5.Vector.dist(cell1.getPosition(), cell2.getPosition()); // distance between the two cells
  if (distance < cell1.getDiameter() + cell2.getDiameter()) {
    // if the distance is less than the sum of the radii
    return true;
  } else {
    return false;
  }
}

/**
 * Collide two cells together
 * @param {Array} cellsArray Array of Cell objects to draw
 */
function collideCells(cellsArray) {
  // 1. go through the array
  for (let cell1 of cellsArray) {
    // for each cell1 in the array
    for (let cell2 of cellsArray) {
      // for each cell2 in the array
      if (cell1 !== cell2) {
        // if cell1 is not the same as cell2
        // don't collide with itself or *all* cells will bounce!
        if (checkCollision(cell1, cell2)) {
          // if the two cells are colliding
          // get direction of collision, from cell2 to cell1
          let collisionDirection = p5.Vector.sub(
            // subtract the two positions
            cell1.getPosition(),
            cell2.getPosition()
          ).normalize();
          cell2.applyForce(collisionDirection.mult(-0.3)); // we calculated the direction as from 2-1 so this is backwards
          cell1.applyForce(collisionDirection.mult(0.3));
        }
      }
    }
  }
}

function repelCells(cellsArray, repelCellsArray) {
  // 1. go through the array
  for (let cell1 of cellsArray) {
    // for each cell1 in the array
    for (let cell2 of repelCellsArray) {
      // for each cell2 in the array
      // if cell1 is not the same as cell2
      // don't collide with itself or *all* cells will bounce!
      if (checkCollision(cell1, cell2)) {
        // if the two cells are colliding
        // get direction of collision, from cell2 to cell1
        let collisionDirection = p5.Vector.sub(
          // subtract the two positions
          cell1.getPosition(),
          cell2.getPosition()
        ).normalize();
        cell2.applyForce(collisionDirection.mult(-1.5)); // we calculated the direction as from 2-1 so this is backwards
        cell1.applyForce(collisionDirection.mult(-1.5));
      }
    }
  }
}

/**
 * Constrain cells to sphere world boundaries.
 * @param {Array} cellsArray Array of Cell objects to draw
 */
function constrainCells(cellsArray, worldCenterPos, worldDiameter) {
  // 1. go through the array
  for (let cell of cellsArray) {
    cell.constrainToSphere(worldCenterPos, worldDiameter);
  }
}

/**
 * Setup functions
 */

function setup() {
  createCanvas(800, 600, WEBGL);

  let testCell = new Cell({
    position: createVector(1, 2, 3), // create a vector with x=1, y=2, z=3
    velocity: createVector(-1, -2, -3), // create a vector with x=-1, y=-2, z=-3
    life: 600, // life of 600
    diameter: 35, // diameter of 35
  });

  // console.log("Testing cell:");
  // console.log(testCell);

  // This is for part 2: creating a list of cells
  cells = createCellsArray(15);
  cells2 = repelCellsArray(10);
  // console.log(cells2);
}

function isAlive(cell) {
  print(cell.getLife()); // print the life of the cell
  if (cell.getLife() > 0) {
    // if the cell is alive
    return true;
  } else {
    return false;
  }
}

function getAlive(cellsArray) {
  // for (let cell of cellsArray) {
  //   print(isAlive(cell));
  // }
  return cellsArray.filter(isAlive); // filter the array to only include alive cells
}

function mitosis(cellsArray) {
  let newCells = [];
  for (let cell of cellsArray) {
    if (cell.getLife() < 4) {
      // if the cell is old enough
      if (random(100) < 5) {
        // if the random number is less than 5
        newCells.push(new Cell(cell)); // push a new cell onto the array
        newCells.push(new Cell(cell)); // push a new cell onto the array
      }
    }
  }
  return cellsArray.concat(newCells);
}

///----------------------------------------------------------------------------
/// p5js draw function
///---------------------------------------------------------------------------
function draw() {
  //Call this new function in draw, before checking for collisions. If you’ve done things right your cells will all suddenly disappear in a little bit.
  orbitControl(); // camera control using mouse

  //lights(); // we're using custom lights here
  directionalLight(180, 180, 180, 0, 0, -width / 2);
  directionalLight(255, 255, 255, 0, 0, width / 2);

  ambientLight(60);
  pointLight(200, 200, 200, 0, 0, 0, 50);
  noStroke();
  background(80); // clear screen
  fill(180, 50, 50);
  ambientMaterial(80, 202, 94); // magenta material

  collideCells(cells); // handle
  repelCells(cells, cells2);
  constrainCells(cells, createVector(0, 0, 0), width); // keep cells in the world
  cells = getAlive(cells); // filter out dead cells
  // console.log(cells); // print the cells to the console

  drawCells3D(cells); // draw the cells
  drawCells3D(cells2);

  // draw world boundaries
  ambientMaterial(255, 102, 94); // magenta material for subsequent objects
  sphere(width); // this is the border of the world, a little like a "skybox" in video games
}
