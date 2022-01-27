import * as p5 from "p5";
import { getRandomInt } from "./population";
import { GlobalVar } from "./sketch";

export default class DNA{
  genes: p5.Vector[];
    //pt voir si ya des constructeurs plus clean
    constructor(genes?: p5.Vector[]){
      if(genes === undefined){
        this.genes = [];
        this.addGenes();
      }
      else
        this.genes = genes;
    }


    addGenes(){
      for(let i= this.genes.length; i< GlobalVar.lifespan; i++){
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(GlobalVar.maxForce);
      }
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
        if(Math.random()< 0.01 ){
          const mutationChoice = Math.random();
          if(mutationChoice< 0.33)
            this.genes[i] = p5.Vector.random2D();
          else if(mutationChoice< 0.66){
            //this.genes[i] = p5Glob.createVector(0,0);
            if(i != 0 && i !=this.genes.length-1){
              const v1 = this.genes[i-1].copy();
              const v2 = this.genes[i+1].copy();
              const v = v1.add(v2).mult(0.5);
              this.genes[i] = v;
              
            }
            
          }
          else
            this.genes[i].mult(10);
          this.genes[i].setMag(GlobalVar.maxForce);
        }
      }
    }
  }