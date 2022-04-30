import { GameSolver } from "../lib/game-solver";
import { IGridConfig } from "../lib/types";
import { drawGrid } from "../lib/visualizer";
import { easyGrid1, primitiveGrid1 } from "./test-data";

solveGrid(easyGrid1);


function solveGrid(gridConfig: IGridConfig): void {
    console.log('Initial value:');
    drawGrid(gridConfig.initialValue, gridConfig.size);
    
    const game1 = new GameSolver(gridConfig);
    
    console.log('Solved grid:');
    const solvedGrid = game1.solveGame()
    drawGrid(solvedGrid, gridConfig.size);
}