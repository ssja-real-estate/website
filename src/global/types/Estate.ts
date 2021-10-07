interface Estate {
  title: string;
  delegationType: string;
  estateType: string;
  city: string;
  province: string;
}

interface Unit {
  id: string;
  value: string;
}

export type { Estate, Unit };
