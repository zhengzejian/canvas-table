
export interface State {
    canvasEle: HTMLCanvasElement | null;
    canvasCtx: CanvasRenderingContext2D | null;
    columns: Column[];
    unionColumn: UnionColumn[];
    unionData: SingleData[],
    totalWidth: number;
    totalHeight: number;
}
export interface Column {
    width: number;
    label: string;
    key: string;
}

export type SingleData = {
    y: number;
    [index: string]: any;
}

export type UnionColumn = Column & { x: number }

export type Fn = () => void

export type TAnyFunction = (...args: any[]) => void;
export interface TextOverflowData {
    textWidth: number;
    isOverflow: boolean;
    text: string;
}