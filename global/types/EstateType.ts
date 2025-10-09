interface EstateType {
  id: string;
  name: string;
  order:number;
}

export const defaultEstateType: EstateType = {
  id: "",
  name: "",
  order:1,
};

export default EstateType;
