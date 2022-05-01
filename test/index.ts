import { GameSolver } from "../lib/game-solver";
import { IGridConfig } from "../lib/types";
import { drawGrid } from "../lib/visualizer";
import { easyGrid1, mediumGrid1, primitiveGrid1 } from "./test-data";

solveGrid(mediumGrid1);


function solveGrid(gridConfig: IGridConfig): void {
    console.log('Initial value:');
    drawGrid(gridConfig.initialValue, gridConfig.size);
    
    const game = new GameSolver(gridConfig);
    const solvedGrid = game.solveGame();
     
    console.log('Solved grid:');
    drawGrid(solvedGrid, gridConfig.size);
}