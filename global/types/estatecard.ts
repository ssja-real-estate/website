export interface PriceEntry {
    label: string;   // مثل «مبلغ رهن» یا «کرایه ماهانه»
    amount: number;  // تومان
  }
  
  export interface EstateCardProps {
    id: string;
    title: string;
    address: string;
    prices: PriceEntry[];   // ← حالا فهرست است
    images: string[];
  }