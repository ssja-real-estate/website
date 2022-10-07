export enum Role {
  MORTGAGE = "رهن",
  SALE = "فروش",
  Rent = "اجاره",
}
class RealEastate {
  id: number;
  type: Role;
  state: string;
  address: string;
  price: number;
  picsrc: string;
  constructor(
    id: number,
    type: Role,
    state: string,
    address: string,
    price: number,
    picsrc: string
  ) {
    this.id = id;
    this.type = type;
    this.state = state;
    this.address = address;
    this.price = price;
    this.picsrc = picsrc;
  }
}
export default RealEastate;
