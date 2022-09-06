import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Estate } from "../../../global/types/Estate";

const RealEstateCard: React.FC<{
  estates: Estate;
}> = (props) => {
  const router = useRouter();
  return (
    <a target="_blank" href={`/estate/${props.estates.id}`} rel="noreferrer">
      <div className="bg-white relative after:absolute  after:block  after:border-t-[5px] after:border-l-[5px] after:border-l-[#f6f6f6] after:border-t-[#00887c] after:top-20 after:-left-1 after:-z-10 after:w-2 after:h-2 cursor-pointer transition-all duration-100 ease-in hover:shadow-lg hover:-translate-y-3">
        <span className="absolute z-10 top-10 -left-1  text-white bg-[#0ba] px-3 py-2">
          {"برای " + props.estates.dataForm.title}
        </span>
        <div className="w-full z-10">
          <Image
            src="/image/estate/e1.jpg"
            alt="house"
            layout="responsive"
            width={554}
            height={360}
          />
        </div>
        <div className="px-2 py-4 divide-y divide-dashed">
          <div className="">
            <h3 className="font-bold text-[#2c3e50]">
              {props.estates.province.name}
            </h3>
            <p className="text-[#2c3e50]">
              {props.estates.city.name + "، " + props.estates.neighborhood.name}
            </p>
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
    </a>
  );
};

export default RealEstateCard;
