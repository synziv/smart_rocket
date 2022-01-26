import * as p5 from "p5";
import { p5Glob } from "./index";
import Population from "./population";

interface IObstacle{
  x: number,
  y: number, 
  w: number,
  h: number
}

export class GlobalVar{
  public static successful: number =0;
  public static livingRockets: number =0;
  public static count: number =0;
  public static maxDist: number =0;
  public static maxForce: number =0.2;
  public static lifespan: number =250;//nb of frames to live
  public static displayAllPopulation: boolean =true;

  public static obstacles: IObstacle[] =[{
    x: 100,
    y: 150,
    w: 300,
    h: 10
   },
  // {
  //   x: 0,
  //   y: 250,
  //   w: 300,
  //   h: 10
  // }
  ];
}
export let target: p5.Vector;
let button: p5.Element;
let gen = 0;
let genP: p5.Element;

let population: Population;

export function setup(p5: p5) {
  p5.createCanvas(400, 400);
  GlobalVar.maxDist = p5.dist(400, 400, p5.width/2, 20);
  population = new Population();
  genP = createCustomP(
    {x: 300, y: 0},
    [
      ['font-size', '16px'],
      ['color', 'white']
    ]  
  );
  target = p5.createVector(p5.width/2, 20);
  button = p5.createButton('Show the fittest');
  button.mousePressed(changeDisplayPopulation);
}

export function draw(p5: p5) {
  p5.background(20); //couleur
  population.run();
  p5.ellipse(target.x, target.y, 16, 16);
  drawObstacles();
  genP.html("Generation: "+ gen);
  if(GlobalVar.count == GlobalVar.lifespan || GlobalVar.livingRockets == 0){
    GlobalVar.count =0;
    GlobalVar.successful = 0;
    population.evaluate();
    population.selection();
    gen++;
  }
  GlobalVar.count++;
}

function changeDisplayPopulation() {
  GlobalVar.displayAllPopulation = !GlobalVar.displayAllPopulation;
}

function drawObstacles(){
  //obstacle
  const {obstacles} = GlobalVar;
  for(let i =0; i<obstacles.length; i++){
    //console.log(obstacle);
    p5Glob.rect(obstacles[i].x, obstacles[i].y, obstacles[i].w, obstacles[i].h);
  }
}

function createCustomP(pos: {x:number, y:number}, style: [string, string][]){
  const customP = p5Glob.createP();
  customP.position(pos.x, pos.y);
  for(let i=0; i<style.length;i++){
    customP.style(...style[i]);
  }
  return customP;
}





