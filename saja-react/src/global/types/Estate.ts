interface Estate {
    title: string;
    delegationType: string;
    estateType: string;
    city: string;
    province: string;
}

interface DelegationType {
    value: string;
}

interface EstateType {
    value: string;
}

export type { Estate, DelegationType, EstateType };
