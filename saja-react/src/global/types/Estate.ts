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

interface Province {
    id: string;
    value: string;
}

interface City {
    id: string;
    value: string;
}

interface Unit {
    id: string;
    value: string;
}

export type { Estate, DelegationType, EstateType, Province, City, Unit };
