import { IExtendedGridConfig, IGrid, IGridConfig } from "./types";
import { Utils } from "./utils";

export class GameSolver {

    public solvedGrid: IGrid | null = null;

    private config: IExtendedGridConfig;
    private grid: IGrid;

    constructor(gridConfig: IGridConfig) {
        this.config = Utils.getExtendedConfig(gridConfig);
        this.grid = { ...this.config.initialGrid };
    }

    public solveGame(): void {
        // Implement
    }
}