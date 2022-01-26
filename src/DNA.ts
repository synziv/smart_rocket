import * as p5 from "p5";
import { getRandomInt } from "./population";
import Rocket from "./rocket";
import { GlobalVar } from "./sketch";

export default class DNA{
  genes: p5.Vector[];
    //pt voir si ya des constructeurs plus clean
    constructor(genes?: p5.Vector[]){
      if(genes === undefined){
        this.genes = [];
        for(let i= 0; i< GlobalVar.lifespan; i++){
          this.genes[i] = p5.Vector.random2D();
          this.genes[i].setMag(GlobalVar.maxForce);
        }
      }
      else
        this.genes = genes;
    }
  
    crossover = (partnerDna: DNA)=>{
      let newGenes = [];
      let mid = Math.floor(getRandomInt(this.genes.length)); // essayer avec different midpoint, genre le milieu exact
  
      for(let i =0; i < this.genes.length; i++){
        if(i > mid)
          newGenes[i] = this.genes[i];
        else
          newGenes[i] = partnerDna.genes[i];
      }
  
      return new DNA(newGenes);
    }


    mutation = () => {
      for(let i =0; i< this.genes.length; i++){
        if(Math.random()< 0.01){
          if(Math.random()< 0.5)
            this.genes[i] = p5.Vector.random2D();
          else
            if(i!=0)
              this.genes[i] = this.genes[i-1];
          this.genes[i].setMag(GlobalVar.maxForce);
        }
      }
    }
  }