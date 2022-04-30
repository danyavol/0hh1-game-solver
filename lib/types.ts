export type ICell = 0 | 1 | null;

export type IGrid = {
    [coords: string]: ICell
};

export interface IGridConfig {
    size: 4 | 6 | 8 | 10 | 12;
    initialValue: IGrid;
}

export interface IExtendedGridConfig extends IGridConfig {
    initialGrid: IGrid;
    maxEqualCellsInLine: number;
}

export type ILineData = ICell[];

export type ILineType = 'row' | 'column';

export type ILineNumber = number;

export type ILineInfo = [ILineType, ILineNumber];

export type ILineId = string;