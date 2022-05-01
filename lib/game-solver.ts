import { IExtendedGridConfig, IGrid, IGridConfig, ILineData, ILineId } from "./types";
import { Utils } from "./utils";
import { drawGrid } from "./visualizer";
import { performance } from 'perf_hooks';

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
        const solveStart = performance.now();
        do {
            checkResult = this.checkLines();
        } while(!(checkResult.isGameSolved || checkResult.isFailed))

        const solvedIn = performance.now() - solveStart;
        console.log('solved in', solvedIn, 'ms');

        if (checkResult.isFailed) {
            console.log('Couldn\'t solve the game');
        }
        return this.grid;
    }

    private checkLines(): LineCheckResult {
        this.currentLinesToCheck.forEach(lineId => {
            const lineData = this.utils.getLineData(lineId, this.grid);
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
                this.nextLinesToCheck = new Set(this.utils.getUnsolvedLines(this.grid));
                // return { isGameSolved: false, isFailed: true };
            }
            this.currentLinesToCheck = new Set(this.nextLinesToCheck.values());
            this.nextLinesToCheck = new Set();
            
            return { isGameSolved: false, isFailed: false };
        }
    }

    private partiallySolveLine(lineData: ILineData, lineId: ILineId): { newLine: ILineData, affectedLines: ILineId[] } {
        const affectedLines: ILineId[] = [];
        
        // Grid cannot have 3 equal cells in a line
        let lastTryWasSuccessful: boolean;
        do {
            lastTryWasSuccessful = false;
            lineData.forEach((currCell, currIndex) => {
                if (currIndex - 1 < 0 || currIndex + 1 >= lineData.length) return;
    
                const nextIndex = currIndex + 1;
                const nextCell = lineData[nextIndex];
                const prevIndex = currIndex - 1;
                const prevCell = lineData[prevIndex];
                
                if (this.utils.isSameColor(currCell, nextCell) && prevCell === null) {
                    lineData[prevIndex] = this.utils.getOppositeColor(currCell);
                    affectedLines.push(this.utils.getAffectedLineId(lineId, prevIndex));
                    lastTryWasSuccessful = true;
                } else if (this.utils.isSameColor(prevCell, currCell) && nextCell === null) {
                    lineData[nextIndex] = this.utils.getOppositeColor(currCell);
                    affectedLines.push(this.utils.getAffectedLineId(lineId, nextIndex));
                    lastTryWasSuccessful = true;
                } else if (this.utils.isSameColor(prevCell, nextCell)  && currCell === null) {
                    lineData[currIndex] = this.utils.getOppositeColor(nextCell);
                    affectedLines.push(this.utils.getAffectedLineId(lineId, currIndex));
                    lastTryWasSuccessful = true;
                }
            });
        } while(lastTryWasSuccessful)
        

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
        const amountOfNulls = lineData.filter(cell => cell === null).length;
        if (amountOfNulls === 2) {
            const otherLineIds = this.utils.getOtherFilledLines(lineId, this.grid);

            for (let otherLineId of otherLineIds) {
                if (this.utils.isLinesPotentiallySame(otherLineId, lineId, this.grid)) {
                    const firstIndex = lineData.findIndex((cell) => cell === null);
                    const secondIndex = lineData.findIndex((cell, index) => cell === null && firstIndex !== index);

                    const filledLineData = this.utils.getLineData(otherLineId, this.grid);

                    lineData[firstIndex] = filledLineData[secondIndex];
                    lineData[secondIndex] = filledLineData[firstIndex];

                    affectedLines.push(this.utils.getAffectedLineId(lineId, firstIndex));
                    affectedLines.push(this.utils.getAffectedLineId(lineId, secondIndex));
                    break;
                }
            }
        }

        return { newLine: lineData, affectedLines };
    }

    
}