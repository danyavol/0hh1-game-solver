import { GameSolver } from "../lib/game-solver";
import { primitiveGrid1 } from "./test-data";

const game1 = new GameSolver(primitiveGrid1);

game1.solveGame();

console.log(game1.solvedGrid);