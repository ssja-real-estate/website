interface DelegationType {
  id: string;
  name: string;
  order?: number;
}

const defaultDelegationType = {
  id: "",
  name: "",
  order:1,
};

export default DelegationType;
export { defaultDelegationType };
