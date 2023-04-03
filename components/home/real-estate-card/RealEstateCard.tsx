import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Estate } from "../../../global/types/Estate";
import { FieldType } from "../../../global/types/Field";

const RealEstateCard: React.FC<{
  estates: Estate;
}> = (props) => {
  function imageFromPropsEstate(): string {
    let srcset = "/image/blankImage/bl.jpg";
    props.estates.dataForm.fields.map((es) => {
      if (es.type === FieldType.Image && (es.value as []).length > 0) {
        srcset = `https://ssja.ir/api/images/${props.estates.id}/${String(
          (es.value as []).at(0)
        )}`;
      }
    });
    return srcset;
  }

  const router = useRouter();
  return (
    <Link
      href={`/estate/${props.estates.id}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="bg-white relative after:absolute  after:block  after:border-t-[5px] after:border-l-[5px] after:border-l-[#f6f6f6] after:border-t-[#00887c] after:top-20 after:-left-1 after:-z-10 after:w-2 after:h-2 cursor-pointer transition-all duration-100 ease-in hover:shadow-lg hover:-translate-y-3">
        <span className="absolute z-[5] top-10 -left-1 text-sm sm:text-[12px] h-10 text-white bg-[#0ba] px-3 py-2">
          {"برای " + props.estates.dataForm.title}
        </span>
        <div className="w-full z-10">
          <Image
            src={imageFromPropsEstate()}
            alt="house"
            layout="responsive"
            width={554}
            height={360}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/image/load/spinner.gif"
          />
        </div>
        <div className="px-2 py-4">
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
            {/* <div className="flex flex-row gap-2 items-end">
              <span className="text-2xl font-bold">
                {(150000000).toLocaleString("fa-ir")}
              </span>
              <span>تومان</span>
            </div> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RealEstateCard;
