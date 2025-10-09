interface EstateType {
  id: string;
  name: string;
  order?:number;
}

export const defaultEstateType: EstateType = {
  id: "",
  name: "",
  order:0,
};

export default EstateType;
