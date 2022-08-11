import React from "react";
import Select from "react-select";

const SelectBox: React.FC<{ options: {}[]; placehodler: string }> = (props) => {
  return (
    <>
      <Select
        options={props.options}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: 0,
            boxShadow: "none",
            height: "48px",
            borderColor: "#e5e7eb",
            "&:focus-within": {
              boxShadow: "0 5px 10px 1px rgba(0, 187, 170, 0.2)",
              border: "1px solid  #0ba",
            },
          }),
          option: (provided, state) => ({
            ...provided,
            borderRadius: 0,
            backgroundColor: state.isFocused ? "rgba(0, 187, 170, 0.2)" : "",
            color: "black",
            "&:hover": {
              backgroundColor: "#0ba",
            },
          }),

          menu: (prev) => ({
            ...prev,
            borderRadius: 0,
          }),
        }}
        placeholder={props.placehodler}
      />
    </>
  );
};

export default SelectBox;
