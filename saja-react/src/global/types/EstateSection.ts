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
    order: number;
    value: any;
    options?: string[];
    fields?: Field[];
    min?: number;
    max?: number;
}

interface Section {
    name: string;
    title: string;
    fields: Field[];
}

interface EstateForm {
    id: number;
    sections: Section[];
}

export type { EstateForm, Section, Field };
export { FieldType };
