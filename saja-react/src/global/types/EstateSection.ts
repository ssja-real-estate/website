interface InputItems {
    name: string;
    type: string;
    title: string;
    order: number;
    value: string;
    data?: string[];
}

interface Section {
    section: {
        name: string;
        title: string;
        order: number;
        items: InputItems[];
    };
}

export type { Section };
