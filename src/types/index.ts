export interface Column {
    width: number;
    label: string;
    key: string;
}

export type $columns = Column & { x: number }

export type Fn = () => void