class RoadNode{
  constructor(x ,y, prv, nxt){
    this.pos = createVector(x, y);
    this.c = [200,200,200,150];
    this.s = 20;
  }

  show(){
    stroke(0);
    fill(this.c);

    ellipse(this.pos.x, this.pos.y, this.s);
  }
}
