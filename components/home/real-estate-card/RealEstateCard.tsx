import Image from "next/image";
import React from "react";
import RealEastate from "../../../data/models/real-estate";

const RealEstateCard: React.FC<{
  realEastate: RealEastate;
}> = (props) => {
  return (
    <div className="bg-white relative after:absolute  after:block after:contents:' ' after:border-t-[5px] after:border-l-[5px] after:border-l-[#f6f6f6] after:border-t-[#00887c] after:top-20 after:-left-1 after:-z-10 after:w-2 after:h-2">
      <span className="absolute z-10 top-10 -left-1  text-white bg-[#0ba] px-3 py-2">
        {"برای " + props.realEastate.type}
      </span>
      <div className="w-full z-10">
        <Image
          src={props.realEastate.picsrc}
          alt="house"
          layout="responsive"
          width={554}
          height={360}
        />
      </div>
      <div className="px-2 py-4 divide-y divide-dashed">
        <div className="">
          <h3 className="font-bold text-[#2c3e50]">
            {props.realEastate.state}
          </h3>
          <p className="text-[#2c3e50]">{props.realEastate.address}</p>
        </div>
        <div className="flex flex-row justify-between items-end text-[#0ba] pt-2 mt-2">
          <div className="flex flex-col">
            {/* <span>کمیسیون</span>
              <span className="text-2xl font-bold">5%</span> */}
          </div>
          <div className="flex flex-row gap-2 items-end">
            <span className="text-2xl font-bold">
              {(150000000).toLocaleString("fa-ir")}
            </span>
            <span>تومان</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateCard;
