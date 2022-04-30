import { IGrid } from "./types";

export function drawGrid(gridData: IGrid, gridSize: number): void {
    let result = '\n';
    for (let row = 0; row < gridSize; row++) {
        for (let column = 0; column < gridSize; column++) {
            const cell = gridData[`${column}x${row}`];
            if (cell === 0) result += ' 0';
            else if (cell === 1) result += ' 1';
            else result += ' _';
        }
        result += '\n';
    }
    console.log(result);
}