class Car {
  constructor(playerNo, pos1, pos2,img){
    this.number = playerNo;
    this.facing = this.decideDir(pos1,pos2);
    this.pos = this.decidePos(pos1,pos2);
    this.size = createVector(21,37);
    this.img = img;
    this.speed = 0;
    this.vel = createVector(0,0);
    this.friction = 0.015;
    this.c = [random(255),random(255),random(255)];
    this.axleOff = 8;
    this.onTrack = [];
    this.on = 0;
  }

  decidePos(pos1, pos2){
    switch(this.number){
      case 0:
        return(createVector(pos1.pos.x - 12, pos1.pos.y + 12));
        break;

      case 1:
        return(createVector(pos1.pos.x + 12, pos1.pos.y -12));
        break;

      default:
        console.log("Error: car.js -> decidePos");
        return(0);
    }
  }

  decideDir(pos1, pos2){
    if(pos1.pos.x > pos2.pos.x && pos1.pos.y > pos2.pos.y){
      return(atan((pos1.pos.y-pos2.pos.y)/(pos1.pos.x-pos2.pos.x)) + PI/2);
    }
    else if(pos1.pos.x < pos2.pos.x && pos1.pos.y > pos2.pos.y){
      return((3*PI)/2 - atan((pos1.pos.y-pos2.pos.y)/(pos2.pos.x-pos1.pos.x)));
    }
    else if(pos1.pos.x > pos2.pos.x && pos1.pos.y < pos2.pos.y){
      return(atan((pos1.pos.x-pos2.pos.x)/(pos2.pos.y-pos1.pos.y)));
    }
    else if(pos1.pos.x < pos2.pos.x && pos1.pos.y < pos2.pos.y){
      return(TWO_PI - atan((pos2.pos.x-pos1.pos.x)/(pos2.pos.y-pos1.pos.y)));
    }
    else{
      console.log("Error: car.js -> decideDir");
      return(0);
    }
  }

  show(){
    push();

    translate(this.pos.x , this.pos.y);
    rotate(this.facing);

    imageMode(CENTER);
    image(this.img, 0,  this.axleOff, this.size.x, this.size.y);

    pop();
  }

  update(){
    this.checkOnTrack();

    this.speed = constrain(this.speed,-2,8);


    this.vel.x = this.speed * sin(-this.facing);
    this.vel.y = this.speed * cos(-this.facing);

    this.pos.y += this.vel.y;
    this.pos.x += this.vel.x;

    //console.log(this.on);

    console.log(this.friction);
    if(this.speed == 0){
      this.speed = this.speed;
    }
    else if(this.speed > 0){
      this.speed -= this.friction;
    }
    else if(this.speed < 0){
      this.speed += this.friction;
    }

    if(this.on == 1){
      this.friction = 0.012;
    }
    else if(this.on == 0){
      //this.friction = 0.029;
      this.friction = constrain(this.friction,0, 0.019);
      this.friction *= 1.5;
    }
    else{
      console.log("error with car.js, this.on");
    }

    this.onTrack = [];
  }

  turn(dir){
    //Driving forward
    if(this.speed >= 0){
      if(this.speed <= 1){
        this.turnSpeed(dir, 0.015);
      }
      else{
        this.turnSpeed(dir, 0.03);
      }
    }
    //Driving Backwards turning is inverted
    else if(this.speed < 0){
      if(this.speed >= -1){
        this.turnSpeed(dir, -0.015);
      }
      else{
        this.turnSpeed(dir, -0.03);
      }
    }
    else{
      console.log("Error: Car.js -> turn - invalid speed.")
    }
  }

  turnSpeed(dir, spd){
    if(dir == "left"){
      this.facing -= spd;
    }
    else if(dir == "right"){
      this.facing += spd;
    }
    else{
      console.log("Error: Car.js -> turnSpeed - ");
    }
  }

  accel(dir){
    switch(dir){
      case "forward":
        this.speed += 0.03;
        break;

      case "backward":
        this.speed -= 0.05;
        break;

      default:
        console.log("Error: Car.js -> accel - Invalid input.");
        break;
    }
  }

  offscreen(w,h){
    //top
    if(this.pos.y <= -this.size.y){
      this.pos.y = h;
    }
    //bottom
    else if(this.pos.y >= h + this.size.y){
      this.pos.y = 0;
    }
    //left
    else if(this.pos.x <= -this.size.x){
      this.pos.x = w;
    }
    //right
    else if(this.pos.x >= w+this.size.x){
      this.pos.x = 0;
    }
    //Onscreen
    else{
      return 0;
    }
  }

  checkOnTrack(){

    let k = 0;
    this.on = 0;

    while(k<=this.onTrack.length-1 && this.on == 0){
      //console.log(k);
      if(this.onTrack[k] == 1){
        //console.log("ontrack");
        this.on = 1;
      }
      else if(this.onTrack[k] == 0){
        //console.log("offtrack");
        this.on = 0;
        k++;
      }
    }
    if(this.on == 1){
      //console.log("ontrack");
    }
    else{
      //console.log("offtrack");
    }
  }
}
