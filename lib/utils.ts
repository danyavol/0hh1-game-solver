import { IExtendedGridConfig, IGrid, IGridConfig, IGridLine } from "./types";

export class Utils {

    static getExtendedConfig(config: IGridConfig): IExtendedGridConfig {
        return {
            ...config,
            initialGrid: Utils.createGridFromConfig(config),
            maxEqualCellsInLine: config.size / 2
        };
    }

    static createGridFromConfig(config: IGridConfig): IGrid {
        const grid: IGrid = {};
        for (let column = 0; column < config.size; column++) {
            for (let row = 0; row < config.size; row++) {
                const cellIndex = `${column}x${row}`;
                grid[cellIndex] = config.initialValue[cellIndex] || null;
            }
        }
        return grid;
    }

    static getGridRow(row: number, grid: IGrid, config: IGridConfig): IGridLine {
        const gridLine: IGridLine = [];
        for (let column = 0; column < config.size; column++) {
            gridLine.push(grid[`${column}x${row}`]);
        }
        return gridLine;
    }

    static getGridColumn(column: number, grid: IGrid, config: IGridConfig): IGridLine {
        const gridLine: IGridLine = [];
        for (let row = 0; row < config.size; row++) {
            gridLine.push(grid[`${column}x${row}`]);
        }
        return gridLine;
    }

    static isLineValid(line: IGridLine, isComplete: boolean, config: IExtendedGridConfig): boolean {
        if (isComplete && line.includes(null)) return false;

        // Rule 1: Grid cannot have 3 equal cells in a line
        const stringLine = line.join();
        if (stringLine.includes('0,0,0') || stringLine.includes('1,1,1')) {
            return false;
        }

        const cellsCount = { '0': 0, '1': 0, 'null': 0 };
        for (let i = 0; i < config.size; i++) {
            cellsCount[String(line[i])]++;
            // Rule 2: Complete line should have equal amount of different cells
            if (cellsCount['0'] > config.maxEqualCellsInLine || cellsCount['1'] > config.maxEqualCellsInLine) {
                return false;
            }            
        }

        return true;
    }

    static isLineUnique(line: IGridLine, otherLines: IGridLine[]): boolean {
        // Rule 3: All rows should be unique. The same for columns
        const lineString = line.join();
        return !otherLines.some(otherLine => lineString === otherLine.join());
    }

    static isGridCompleteAndValid(grid: IGrid, config: IExtendedGridConfig): boolean {
        const rows: IGridLine[] = [], columns: IGridLine[] = [];
        for (let i = 0; i < config.size; i++) {
            rows.push(Utils.getGridRow(i, grid, config));
            columns.push(Utils.getGridColumn(i, grid, config));
        }

        const allRowsValid = rows.every((row, index) => {
            const otherRows = [...rows].splice(index, 1);
            return Utils.isLineValid(row, true, config) && Utils.isLineUnique(row, otherRows);
        });

        const allColumnsValid = columns.every((column, index) => {
            const otherColumns = [...columns].splice(index, 1);
            return Utils.isLineValid(column, true, config) && Utils.isLineUnique(column, otherColumns);
        });

        return allRowsValid && allColumnsValid;
    }

}
