import React, { FC, useState } from "react";
import * as IoIcon from "react-icons/io";
const MultiSelectView: FC<{ title: string; options: string[] }> = (props) => {
  return (
    <div className="flex flex-col gap-0">
      <li className="flex flex-row gap-2 items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full">
        {props.title} :
      </li>
      <div className="text-gray-600 pr-5">
        <div className="flex flex-row flex-wrap gap-1 items-center">
          {props.options.length > 0 ? (
            props.options.map((option, index) => (
              <span
                className="mx-2  before:rounded-full before:w-1 before:h-1 before:bg-[#0ba]/40 before:block flex flex-row gap-1 items-center"
                key={index}
              >
                {option}
              </span>
            ))
          ) : (
            <span className="mx-2 text-gray-400">
              بخش یا امکاناتی اعمال نشده است!!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelectView;
