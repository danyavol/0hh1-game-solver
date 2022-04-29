import { IGridConfig } from "../lib/types";

// Blue == 0
// Red == 1

export const primitiveGrid1: IGridConfig = {
    size: 4,
    initialValue: {
        '1x0': 1,
        '2x1': 0,
        '3x3': 0
    }
};

export const easyGrid1: IGridConfig = {
    size: 6,
    initialValue: {
        '0x0': 0,
        '2x1': 1, '5x1': 0,
        '0x2': 1, '4x2': 0,
        '1x3': 0, '2x3': 0, '5x3': 1,
        '2x5': 0
    }
};

export const mediumGrid1: IGridConfig = {
    size: 8,
    initialValue: {
        '3x0': 1, '4x0': 1, '6x0': 1,
        '4x1': 1, '5x1': 1, '6x1': 0,
        '1x2': 0, '3x2': 0,
        '4x4': 1, '7x4': 1,
        '0x5': 0, '2x5': 0, '4x5': 0,
        '1x6': 1, '6x6': 0,
        '2x7': 1, '4x7': 1, '6x7': 1
    }
};