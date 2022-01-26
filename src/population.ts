import Rocket from "./rocket";
import { GlobalVar } from "./sketch";

export default class Population{
  rockets: Rocket[];
  popSize: number;
  constructor(){
    this.rockets = [];
    this.popSize = 250;

    for(let i = 0; i < this.popSize; i++){
      this.rockets[i] = new Rocket("#" + ((1<<24)*Math.random() | 0).toString(16), undefined);
    }
  }


  
    evaluate = ()=>{
      //calculer le fitness de chaque elem
      for(let i = 0; i < this.popSize; i++){
        this.rockets[i].calcFitness(); 
      }
    }

    selection = () => {
        let newPopulation = [];
        let fitnessSum = 0;

        //only keep the best 40%
        this.rockets.sort((a, b) => { return a.fitness - b.fitness });
        this.rockets = this.rockets.slice(this.rockets.length * 0.6, this.rockets.length);


        fitnessSum = this.rockets.reduce((partial_sum, a) => partial_sum + a.fitness, 0);
        //print avg fitness score
        console.log("Avg fitness: "+fitnessSum / this.popSize);
        //print fittest fitness score
        console.log("Best fitness: "+this.rockets[this.rockets.length-1].fitness);
        let completedNb = 0;
        for (let i = 0; i < this.rockets.length; i++) {
            this.rockets[i].fitness /= fitnessSum;
            if(this.rockets[i].completed) completedNb++;
        }
        
        
        //elitism
        const elitismPercentage = 0.07;
        const nbOfElites = this.popSize - Math.floor(this.popSize * (1-elitismPercentage));

        //copy elites to next generation
        for(let i =this.rockets.length-1 ; i >= this.rockets.length - nbOfElites; i--){
            newPopulation.push(new Rocket(this.rockets[i].color, this.rockets[i].dna ))
        }

        //the last added individual is the best of last gen
        //make it show
        newPopulation[newPopulation.length-1].elite = true;
        console.log(newPopulation[newPopulation.length-1].dna);
        //crossover
        for (let i = 0; i < this.popSize - nbOfElites; i++) {
            let parent1 = pickRandom(this.rockets);
            let parent2 = pickRandom(this.rockets);
            let child = parent1.dna.crossover(parent2.dna);
            child.mutation();
            newPopulation.push(new Rocket(parent1.color, child));
        }
      this.rockets = newPopulation;
      GlobalVar.livingRockets = this.popSize;
    }
  
    run = () =>{
      for(let i = 0; i < this.popSize; i++){
        if(!this.rockets[i].crashed && !this.rockets[i].completed )
          this.rockets[i].update();
        if(GlobalVar.displayAllPopulation || this.rockets[i].elite)
        this.rockets[i].show();
    }
  }
}

const pickRandom = (matingPool: Rocket[]) => {
  let pickedParent = null;
  while (pickedParent == null) {
    const randomParent = Math.floor(getRandomInt(matingPool.length));
    const randomPickChance = Math.random();
    pickedParent = matingPool[randomParent];
    if (pickedParent.fitness < randomPickChance)
      pickedParent = null;
  }
  return pickedParent;
}

export function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}