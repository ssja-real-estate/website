export interface Payment {
  id: string;
  title: string;
  credit: number;
  duration: number;
  remainingDuration?: number;
}

export const defaultPayment: Payment = {
  id: "",
  title: "",
  credit: 0,
  duration: 0,
  remainingDuration: 0,
};
