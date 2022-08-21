import { Select } from "react-functional-select";
import { useState, useEffect, useCallback, FC } from "react";
import dataJson from "../../cities.json";

type Option = Readonly<{
  id: number;
  city: string;
  state: string;
}>;

type SingleSelectDemoProps = Readonly<{
  isDisabled: boolean;
}>;

const _cityOptions: Option[] = [
  { id: 1, city: "Austin", state: "TX" },
  { id: 2, city: "Denver", state: "CO" },
  { id: 3, city: "Chicago", state: "IL" },
  { id: 4, city: "Phoenix", state: "AZ" },
  { id: 5, city: "Houston", state: "TX" },
];

const SelectInput: FC<SingleSelectDemoProps> = ({ isDisabled }) => {
  const [province, setProvince] = useState<{}[]>();

  // console.log(dataJson);

  const getProvince = async () => {
    dataJson.map((data) => {
      console.log(data.label === "ارومیه" && data);
    });
  };
  getProvince();

  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  console.log(selectedOption);

  const getOptionValue = useCallback((option: Option): number => option.id, []);
  const onOptionChange = useCallback(
    (option: Option | null): void => setSelectedOption(option),
    []
  );
  const getOptionLabel = useCallback(
    (option: Option): string => `${option.city}, ${option.state}`,
    []
  );
  useEffect(() => {
    isDisabled && setIsInvalid(false);
  }, [isDisabled]);
  return (
    <div>
      <Select
        isClearable
        isInvalid={isInvalid}
        options={_cityOptions}
        isDisabled={isDisabled}
        onOptionChange={onOptionChange}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
      />
    </div>
  );
};

export default SelectInput;
