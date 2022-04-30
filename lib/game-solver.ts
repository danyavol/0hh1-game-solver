import { IExtendedGridConfig, IGrid, IGridConfig, ILineData, ILineId } from "./types";
import { Utils } from "./utils";
import { drawGrid } from "./visualizer";

interface LineCheckResult {
    isGameSolved: boolean;
    isFailed: boolean;
}

export class GameSolver {

    public solvedGrid: IGrid | null = null;

    private utils: Utils;
    private grid: IGrid;

    private currentLinesToCheck: Set<ILineId> = new Set();
    private nextLinesToCheck: Set<ILineId> = new Set();

    constructor(gridConfig: IGridConfig) {
        this.utils = new Utils(gridConfig);
        this.grid = { ...this.utils.config.initialGrid };
        
        for (let lineNumber = 0; lineNumber < this.utils.config.size; lineNumber++) {
            this.currentLinesToCheck.add(`c${lineNumber}`);
            this.nextLinesToCheck.add(`r${lineNumber}`);
        }
    }

    public solveGame(): IGrid {
        let checkResult: LineCheckResult;
        let totalTries = 0;
        do {
            checkResult = this.checkLines();
            console.log(checkResult);
            drawGrid(this.grid, this.utils.config.size);
        } while(!(checkResult.isGameSolved || checkResult.isFailed || ++totalTries > 20))

        if (checkResult.isFailed) {
            console.log('Couldn\'t solve the game');
        }
        return this.grid;
    }

    private checkLines(): LineCheckResult {
        this.currentLinesToCheck.forEach(lineId => {
            const lineData = this.utils.getGridLine(lineId, this.grid);
            const result = this.partiallySolveLine(lineData, lineId);

            result.affectedLines.forEach(affectedLineId => {
                this.nextLinesToCheck.add(affectedLineId);
            });
            this.utils.updateGridLine(lineId, result.newLine, this.grid);
        });

        if (this.utils.isGridCompleteAndValid(this.grid)) {
            return { isGameSolved: true, isFailed: false };
        } else {
            if (this.nextLinesToCheck.size === 0) {
                return { isGameSolved: false, isFailed: true };
            }
            this.currentLinesToCheck = new Set(this.nextLinesToCheck.values());
            this.nextLinesToCheck = new Set();
            
            return { isGameSolved: false, isFailed: false };
        }
    }

    private partiallySolveLine(lineData: ILineData, lineId: ILineId): { newLine: ILineData, affectedLines: ILineId[] } {
        console.log(lineId);
        const affectedLines: ILineId[] = [];
        
        // Grid cannot have 3 equal cells in a line
        lineData.forEach((currCell, currIndex) => {
            if (currIndex - 1 < 0 || currIndex + 1 >= lineData.length) return;

            const nextIndex = currIndex + 1;
            const nextCell = lineData[nextIndex];
            const prevIndex = currIndex - 1;
            const prevCell = lineData[prevIndex];
            
            if (this.utils.isSameColor(currCell, nextCell) && prevCell === null) {
                lineData[prevIndex] = this.utils.getOppositeColor(currCell);
                affectedLines.push(this.utils.getAffectedLineId(lineId, prevIndex));
            } else if (this.utils.isSameColor(prevCell, currCell) && nextCell === null) {
                lineData[nextIndex] = this.utils.getOppositeColor(currCell);
                affectedLines.push(this.utils.getAffectedLineId(lineId, nextIndex));
            } else if (this.utils.isSameColor(prevCell, nextCell)  && currCell === null) {
                lineData[currIndex] = this.utils.getOppositeColor(nextCell);
                affectedLines.push(this.utils.getAffectedLineId(lineId, currIndex));
            }
        });

        // Line already have maximum of one color
        const amountOfZeros = lineData.filter(cell => cell === 0).length;
        const amountOfOnes = lineData.filter(cell => cell === 1).length;
        if (amountOfZeros === this.utils.config.maxEqualCellsInLine) {
            lineData.forEach((cell, index) => {
                if (cell === null) {
                    lineData[index] = 1;
                    affectedLines.push(this.utils.getAffectedLineId(lineId, index));
                }
            });
        } else if (amountOfOnes === this.utils.config.maxEqualCellsInLine) {
            lineData.forEach((cell, index) => {
                if (cell === null) {
                    lineData[index] = 0;
                    affectedLines.push(this.utils.getAffectedLineId(lineId, index));
                }
            });
        }

        // Rule 3: All rows should be unique. The same for columns
        // TODO

        return { newLine: lineData, affectedLines };
    }
}