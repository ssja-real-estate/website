interface Estate {
    title: string;
    delegationType: string;
    estateType: string;
    city: string;
    province: string;
}

interface DelegationType {
    id: string;
    value: string;
}

interface EstateType {
    id: string;
    value: string;
}

export type { Estate, DelegationType, EstateType };
