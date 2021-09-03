enum FieldType {
    String,
    Number,
    Select,
    Bool,
    Conditional,
    Image,
    Range,
}

interface Field {
    name: string;
    type: FieldType;
    title: string;
    value: string | number | boolean | string[] | [number, number];
    options?: string[];
    fields?: Field[];
    min?: number;
    max?: number;
}

export type { Field };
export { FieldType };
