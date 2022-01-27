import * as p5 from "p5";
import DNA from "./DNA";
import { p5Glob } from "./index";
import { GlobalVar, target } from "./sketch";

export default class Rocket {
  dna: DNA;
  color: string;
  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;
  completed: boolean;
  crashed: boolean;
  fitness: number;
  lifeSpan: number;
  elite: boolean;
  constructor(newColor: string, dna?: DNA ) {
    if (dna === undefined) this.dna = new DNA();
    else this.dna = dna;
    this.color = "white";
    if (newColor !== undefined) this.color = newColor;


    this.pos = p5Glob.createVector(p5Glob.width / 2, p5Glob.height); //positionne dans le milieu
    this.vel = p5Glob.createVector();
    this.acc = p5Glob.createVector();
    this.completed = false;
    this.crashed = false;
    this.fitness = 0;
    this.lifeSpan = 0;
    this.elite = false;

  }
  applyForce = (force: p5.Vector) => {
    this.acc.add(force);
  }

  update() {
    let d = p5Glob.dist(this.pos.x, this.pos.y, target.x, target.y);

    if (d < 20) {
      this.completed = true;
      this.pos = target.copy();
      GlobalVar.successful++;
      GlobalVar.livingRockets--;
    }

    this.collisionDetection();

    if (!this.completed) {
      this.applyForce(this.dna.genes[GlobalVar.count]);
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.lifeSpan++;
    }
  }

  show() {
    p5Glob.push();//#1
    p5Glob.translate(this.pos.x, this.pos.y);
    p5Glob.noStroke();
    //gives an angle to where its pointing
    p5Glob.rotate(this.vel.heading());
    p5Glob.rectMode(p5Glob.CENTER);
    p5Glob.fill(p5Glob.color(this.color));
    p5Glob.rect(0, 0, 25, 5);
    p5Glob.pop();//#1 pour modifier slm le rocket de l'instance
  }

  calcFitness() {
    this.fitness = GlobalVar.maxDist - p5Glob.dist(this.pos.x, this.pos.y, target.x, target.y);

    if (this.completed) {
      this.fitness *= Math.pow(GlobalVar.lifespan / this.lifeSpan, 2);
    }
    else if (this.crashed) {
      this.fitness += (GlobalVar.lifespan-this.lifeSpan) / GlobalVar.lifespan;
      Math.sqrt(this.fitness);
    }
  }

  collisionDetection() {
    //collision obstacle
    for (let i = 0; i < GlobalVar.obstacles.length; i++) {
      if (this.pos.x > GlobalVar.obstacles[i].x &&
        this.pos.x < GlobalVar.obstacles[i].x + GlobalVar.obstacles[i].w &&
        this.pos.y > GlobalVar.obstacles[i].y &&
        this.pos.y < GlobalVar.obstacles[i].y + GlobalVar.obstacles[i].h) {
        this.crashed = true;
        GlobalVar.livingRockets--;
      }
    }
    //collision border
    if (this.pos.x > p5Glob.width || this.pos.x < 0) {
      this.crashed = true;
      GlobalVar.livingRockets--;
    }
    if (this.pos.y > p5Glob.height || this.pos.y < 0) {
      this.crashed = true;
      GlobalVar.livingRockets--;
    }
  }

}
