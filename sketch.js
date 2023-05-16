let car = [];
let players = 1;
let carImg;
let nodes = [];
let meshA = [];
let meshB = [];
let state = 0;
let onTrack = false;

function preload() {
  carImg = loadImage('assets/Z.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(28, 198, 19);
  fill(255);
  strokeWeight(1);

  keyDown();

  if (state == 0) {
    for (i = 0; i <= nodes.length - 1; i++) {
      nodes[i].show();
    }
  }

  if (state == 1) {
    //draw track
    for (i = 1; i <= meshA.length - 1; i++) {
      stroke(100, 100, 100);
      fill(100);
      quad(meshA[i - 1].x, meshA[i - 1].y, meshA[i].x, meshA[i].y, meshB[i].x, meshB[i].y, meshB[i - 1].x, meshB[i - 1].y);

      // fill(0);
      // circle(meshA[i].x, meshA[i].y, 5);
      // fill(255);
      // circle(meshB[i].x, meshB[i].y, 5);


      for (j = 0; j <= players - 1; j++) {
        car[j].onTrack.push(checkTrack(meshA[i], meshB[i], meshA[i - 1], meshB[i - 1], car[j]));
      }
    }

    stroke(100, 100, 100);
    fill(100);
    quad(meshA[meshA.length - 1].x, meshA[meshA.length - 1].y, meshA[0].x, meshA[0].y, meshB[0].x, meshB[0].y, meshB[meshA.length - 1].x, meshB[meshA.length - 1].y);

    // fill(0);
    // circle(meshA[0].x, meshA[0].y, 5);

    // fill(255);
    // circle(meshB[0].x, meshB[0].y, 5);

    for (j = 0; j <= players - 1; j++) {
      car[j].onTrack.push(checkTrack(meshA[0], meshB[0], meshA[meshA.length - 1], meshB[meshB.length - 1], car[j]));
    }

    //for(j=0; j<=players-1;j++){
    //  car[j].checkOnTrack();
    //}

    //for(i=0; i<=players-1; i++){
    //  car[i].onTrack = [];
    //}
  }

  for (i = 0; i <= car.length - 1; i++) {
    car[i].show();
    car[i].update();
    car[i].offscreen(width, height);
  }
}

function checkTrack(meshA1, meshB1, meshA2, meshB2, car) {
  if (collidePointTriangle(car.pos.x, car.pos.y, meshA2.x, meshA2.y, meshA1.x, meshA1.y, meshB1.x, meshB1.y) == true || collidePointTriangle(car.pos.x, car.pos.y, meshB2.x, meshB2.y, meshB1.x, meshB1.y, meshA2.x, meshA2.y) == true || collidePointTriangle(car.pos.x, car.pos.y, meshB2.x, meshB2.y, meshA1.x, meshA1.y, meshB1.x, meshB1.y) == true || collidePointTriangle(car.pos.x, car.pos.y, meshB2.x, meshB2.y, meshA1.x, meshA1.y, meshA2.x, meshA2.y) == true) {
    // console.log("on track test");
    return 1;
  }
  else if (collidePointTriangle(car.pos.x, car.pos.y, meshA2.x, meshA2.y, meshA1.x, meshA1.y, meshB1.x, meshB1.y) == false && collidePointTriangle(car.pos.x, car.pos.y, meshB2.x, meshB2.y, meshB1.x, meshB1.y, meshA2.x, meshA2.y) == false && collidePointTriangle(car.pos.x, car.pos.y, meshB2.x, meshB2.y, meshA1.x, meshA1.y, meshB1.x, meshB1.y) == false && collidePointTriangle(car.pos.x, car.pos.y, meshB2.x, meshB2.y, meshA1.x, meshA1.y, meshA2.x, meshA2.y) == false) {
    // console.log("off track");
    return 0;
  }
  else {
    return 2;
  }
}

function keyDown() {
  //left
  if (keyIsDown(LEFT_ARROW)) {
    car[0].turn("left");
  }
  //right
  if (keyIsDown(RIGHT_ARROW)) {
    car[0].turn("right");
  }
  //forward
  if (keyIsDown(UP_ARROW)) {
    car[0].accel("forward");
  }
  //back
  if (keyIsDown(DOWN_ARROW)) {
    car[0].accel("backward");
  }
  //left
  if (keyIsDown(65)) {
    car[1].turn("left");
  }
  //right
  if (keyIsDown(68)) {
    car[1].turn("right");
  }
  //forward
  if (keyIsDown(87)) {
    car[1].accel("forward");
  }
  //back
  if (keyIsDown(83)) {
    car[1].accel("backward");
  }
}

function keyPressed() {
  switch (keyCode) {
    case 13:
      state = 1;
      buildTrack();
      if (state == 1) {
        console.log("Track built.");
        addCars();
        console.log("Cars added.");
      }
      break;

    case 82:
      state = 0;
      resetAll();
      break;

    default:
      return (0);
  }
}

function mousePressed() {
  if (nodes.length == 0 || mouseX != nodes[nodes.length - 1].pos.x || mouseY != nodes[nodes.length - 1].pos.y) {
    nodes.push(new RoadNode(mouseX, mouseY));
  }
  else {
    console.log("Prevented double node being added.");
  }
}

function addCars() {
  for (i = 0; i <= players - 1; i++) {
    car.push(new Car(i, nodes[0], nodes[1], carImg));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function buildTrack() {
  if (nodes.length > 2) {
    let prevBisect;

    for (i = 1; i <= nodes.length - 2; i++) {
      prevBisect = getPoints(i - 1, i, i + 1, prevBisect);
    }

    prevBisect = getPoints(nodes.length - 2, nodes.length - 1, 0, prevBisect);
    prevBisect = getPoints(nodes.length - 1, 0, 1, prevBisect);
  }
  else {
    console.log("More nodes required.");
    state = 0;
  }
}

function getPoints(prev, node, next, prevBisect) {
  let a = nodes[prev];
  let b = nodes[node];
  let c = nodes[next];

  let aVec = createVector(b.pos.x - a.pos.x, b.pos.y - a.pos.y);
  aVec.normalize();
  let bVec = createVector(b.pos.x - c.pos.x, b.pos.y - c.pos.y);
  bVec.normalize();
  let bisect = createVector(aVec.x + bVec.x, aVec.y + bVec.y); // bisect vect
  bisect.normalize();
  bisect = bisect.mult(60);

  // Stop edge points swapping over
  if (prevBisect) {
    const bisectDiff = bisect.angleBetween(prevBisect);

    console.log(bisectDiff);

    if (bisectDiff >= Math.PI / 2) {
      bisect.mult(-1);
    }
  }

  let aPnt = createVector(b.pos.x - bisect.x, b.pos.y - bisect.y);
  let bPnt = createVector(b.pos.x + bisect.x, b.pos.y + bisect.y);

  meshA.push(aPnt);
  meshB.push(bPnt);

  return bisect.copy()
}

function resetAll() {
  nodes = [];
  car = [];
  meshA = [];
  meshB = [];
  console.log("Reset.");
}
