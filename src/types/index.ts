
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
    xLeft: ComputedRef<number>;
    xRight: ComputedRef<number>;
    width: Ref<number>;
}

export type UnionColumnNode = Node<UnionColumn>
export interface State {
    canvasEle: HTMLCanvasElement | null;
    canvasCtx: CanvasRenderingContext2D | null;
    columns: Column[];
    unionColumn: UnionColumn[];
    unionData: SingleData[],
    totalWidth: number;
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