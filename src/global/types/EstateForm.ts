import { Field } from "./Field";

interface Section {
    name: string;
    title: string;
    fields: Field[];
}

interface EstateForm {
    id: number;
    sections: Section[];
}

export type { EstateForm, Section };
