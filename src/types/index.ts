
import { computed, ComputedRef, Ref, ref } from 'vue'
import DoublyLinkedList from '../utils/linkedList'
import { Node } from '../utils/linkedList'

export interface Column {
    width: number;
    label: string;
    key: string;
}

export type SingleData = {
    y: number;
    [index: string]: any;
}


export type UnionColumn = {
    label: string;
    key: string;
    xLeft: number; // ComputedRef<number>;
    xRight: number; // ComputedRef<number>;
    width: number; // Ref<number>;
}

export type UnionColumnNode = Node<UnionColumn>
export type WrapperPosition = {
    left: number;
    top: number;
}
export interface State {
    canvasEle: HTMLCanvasElement | null;
    canvasCtx: CanvasRenderingContext2D | null;
    wrapperPosition: WrapperPosition;
    columns: Column[];
    unionColumn: UnionColumn[];
    unionData: SingleData[],
    totalHeight: number;
    columnLinkList: DoublyLinkedList<UnionColumn>
}

export type Fn = () => void

export type TAnyFunction = (...args: any[]) => void;
export interface TextOverflowData {
    textWidth: number;
    isOverflow: boolean;
    text: string;
}