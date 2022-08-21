import React, { FC, FunctionComponent } from "react";

const SearchForm: FC<{ isShow: boolean }> = (props) => {
  if (props.isShow) {
    return (
      <div className="">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum aperiam
        voluptates cum sunt, maxime quis quae asperiores quos alias fugiat
        dolore vel autem ad reiciendis facere corporis odio ut itaque?
      </div>
    );
  } else {
    return (
      <div className="absolute top-0 transition-all duration-300 ease-in-out h-full w-80 bg-black/40 -right-2/3"></div>
    );
  }
};

export default SearchForm;
