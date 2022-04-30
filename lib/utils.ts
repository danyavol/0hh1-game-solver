import { ICell, IExtendedGridConfig, IGrid, IGridConfig, ILineData, ILineId, ILineInfo, ILineNumber, ILineType } from "./types";

export class Utils {

    public config: IExtendedGridConfig;

    constructor(
        config: IGridConfig
    ) {
        this.config = this.getExtendedConfig(config);
    }

    public getLineInfo(lineId: ILineId): ILineInfo {
        const lineType: ILineType = lineId[0] === 'c' ? 'column' : 'row';
        const lineNumber: ILineNumber = parseInt(lineId.slice(1));
        return [lineType, lineNumber];
    }

    

    public getGridLine(lineId: ILineId, grid: IGrid): ILineData {
        const lineInfo = this.getLineInfo(lineId);
        if (lineInfo[0] === 'row') {
            const row = lineInfo[1];
            const gridLine: ILineData = [];
            for (let column = 0; column < this.config.size; column++) {
                gridLine.push(grid[`${column}x${row}`]);
            }
            return gridLine;
        } 
        else {
            const column = lineInfo[1];
            const gridLine: ILineData = [];
            for (let row = 0; row < this.config.size; row++) {
                gridLine.push(grid[`${column}x${row}`]);
            }
            return gridLine;
        }
    }

    public isLineValid(line: ILineData): boolean {
        // Rule 1: Grid cannot have 3 equal cells in a line
        const stringLine = line.join();
        if (stringLine.includes('0,0,0') || stringLine.includes('1,1,1')) {
            return false;
        }

        const cellsCount = { '0': 0, '1': 0, 'null': 0 };
        for (let i = 0; i < this.config.size; i++) {
            cellsCount[String(line[i])]++;
            // Rule 2: Complete line should have equal amount of different cells
            if (cellsCount['0'] > this.config.maxEqualCellsInLine || cellsCount['1'] > this.config.maxEqualCellsInLine) {
                return false;
            }            
        }

        return true;
    }

    public isLineComplete(line: ILineData): boolean {
        if (!line.includes(null) || this.isLineValid(line)) return true;
        else return false;
    }

    public isLineUnique(line: ILineData, otherLines: ILineData[]): boolean {
        // Rule 3: All rows should be unique. The same for columns
        const lineString = line.join();
        return !otherLines.some(otherLine => lineString === otherLine.join());
    }

    public isGridCompleteAndValid(grid: IGrid): boolean {
        const rows: ILineData[] = [], columns: ILineData[] = [];
        for (let lineNumber = 0; lineNumber < this.config.size; lineNumber++) {
            rows.push(this.getGridLine(`r${lineNumber}`, grid));
            columns.push(this.getGridLine(`c${lineNumber}`, grid));
        }

        const allRowsValid = rows.every((row, index) => {
            const otherRows = [...rows].splice(index, 1);
            return this.isLineComplete(row) && this.isLineUnique(row, otherRows);
        });

        const allColumnsValid = columns.every((column, index) => {
            const otherColumns = [...columns].splice(index, 1);
            return this.isLineComplete(column) && this.isLineUnique(column, otherColumns);
        });

        return allRowsValid && allColumnsValid;
    }

    public updateGridLine(lineId: ILineId, lineData: ILineData, grid: IGrid): void {
        const lineInfo = this.getLineInfo(lineId);
        for (let i = 0; i < this.config.size; i++) {
            const cellId = lineInfo[0] === 'column' ? `${lineInfo[1]}x${i}` : `${i}x${lineInfo[1]}`;
            grid[cellId] = lineData[i];
        }
    }

    public isSameColor(color1: ICell, color2: ICell): boolean {
        return ([0, 1] as any).includes(color1) && color1 === color2;
    }

    public getOppositeColor(color: ICell): ICell {
        if (color === 1) return 0;
        if (color === 0) return 1;
        return null;
    }

    public getAffectedLineId(currentLineId: ILineId, cellNumber: number): ILineId {
        const lineInfo = this.getLineInfo(currentLineId);
        if (lineInfo[0] === 'column') {
            return `r${cellNumber}`;
        } else {
            return `c${cellNumber}`;
        }
    }

    // PRIVATE

    private getExtendedConfig(config: IGridConfig): IExtendedGridConfig {
        return {
            ...config,
            initialGrid: this.createInitialGrid(config),
            maxEqualCellsInLine: config.size / 2
        };
    }

    private createInitialGrid(config: IGridConfig): IGrid {
        const grid: IGrid = {};
        for (let column = 0; column < config.size; column++) {
            for (let row = 0; row < config.size; row++) {
                const cellIndex = `${column}x${row}`;
                grid[cellIndex] = config.initialValue[cellIndex] === undefined ? null : config.initialValue[cellIndex];
            }
        }
        return grid;
    }

}
