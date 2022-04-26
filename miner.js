import RockObj from "./miner/rock_obj.js";
import Rock from "./miner/rock.js";
import randomArray from "random-array";

const rock_obj = new RockObj();
const seed = Math.round(randomArray(0, 1000000).oned(1)[0]);
rock_obj.seed = seed;
console.log(rock_obj);
const rock = new Rock(rock_obj);
console.log(rock);
