import Image, { ImageLoader, StaticImageData } from "next/image";
import { FC, useEffect, useState } from "react";
import { Estate } from "../../../global/types/Estate";
import { Role, roleMap } from "../../../global/types/User";
import * as BiIcon from "react-icons/bi";
import * as MdIcon from "react-icons/md";
import * as BsIcon from "react-icons/bs";
import * as IoIcon from "react-icons/io5";
import * as CgIcon from "react-icons/cg";
import ShimerAnimationEstateCard from "../../ShimerAnimitionEstateCard/ShimerAnimationEstateCard";
import { FieldType } from "../../../global/types/Field";
import { useUnmountEffect } from "framer-motion";
import LabelStatusEstatecard from "./LabelStatusEstatecard";
// const img:ImageLoader = {
//   src: any;
//   width: any;
//   quality: any;
// };
const EstateCardDashboard: FC<{ estate: Estate; userRole: Role }> = (props) => {
  const [src, setSrc] = useState<string | StaticImageData>(
    "/image/estate/e1.jpg"
  );
  useEffect(() => {
    setSrc(imageFromPropsEstate());
  }, [src]);
  const myLoader: ImageLoader = ({ src, width, quality }) => {
    return `https://ssja.ir/api/images/${src}?w=${width}&q=${quality || 100}`;
  };
  function imageFromPropsEstate(): string {
    let srcset = "/image/blankImage/bl.jpg";
    props.estate.dataForm.fields.map((es) => {
      if (es.type === FieldType.Image && (es.value as []).length > 0) {
        srcset = `https://ssja.ir/api/images/${props.estate.id}/${String(
          (es.value as []).at(0)
        )}`;
      }
    });
    console.log(srcset);

    return srcset;
  }
  return (
    <div className="w-full rounded-md overflow-hidden shadow-md relative">
      {/* <div className="absolute bg-white shadow-sm z-10 top-2 flex flex-row items-center justify-center gap-2 py-1 px-2 rounded-tl-2xl rounded-bl-2xl">
        {props.estate.estateStatus.status === 1 ? (
          <IoIcon.IoCheckmarkCircleOutline className="text-green-600 text-2xl" />
        ) : props.estate.estateStatus.status === 2 ? (
          <CgIcon.CgSandClock className="text-gray-400 text-2xl" />
        ) : (
          props.estate.estateStatus.status === 3 && (
            <IoIcon.IoCheckmarkCircleOutline className="text-green-600 text-2xl" />
          )
        )}
        <span className="text-sm">
          {props.estate.estateStatus.status === 1
            ? "تأیید شده"
            : props.estate.estateStatus.status === 2
            ? "در انتظار تأیید"
            : props.estate.estateStatus.status === 3 && "تأیید نشده"}
        </span>
      </div> */}
      <LabelStatusEstatecard estatStatus={props.estate.estateStatus.status} />
      <Image
        // loader={myLoader}
        // src={`https://ssja.ir/api/images/${props.estate.id}/${imageFromPropsEstate}`}
        src={src}
        alt="house"
        layout="responsive"
        width={554}
        height={360}
        loading="lazy"
        placeholder="blur"
        blurDataURL="/image/load/spinner.gif"
      />
      <div className="px-2 py-4 divide-y divide-dashed">
        <div className="">
          <h3 className="font-bold text-[#2c3e50]">
            {props.estate.province.name}
          </h3>
          <p className="text-[#2c3e50]">
            {props.estate.city.name + "، " + props.estate.neighborhood.name}
          </p>
        </div>
        <div className="flex flex-row justify-between items-end pt-2 mt-2">
          <a
            target="_blank"
            href={`/estate/${props.estate.id}`}
            rel="noreferrer"
            className="flex flex-row border py-2 px-2 rounded-full item-center justify-center gap-2 group hover:scale-105 hover:shadow-md transition-all hover:bg-[#0ba] hover:border-none"
          >
            <span title="اطلاعات کامل ملک">
              <BsIcon.BsInfoCircleFill className="text-gray-400 group-hover:text-white" />
            </span>
          </a>
          <div className="flex flex-row gap-2 items-end">
            <button className="flex flex-row border py-2 px-2 rounded-full item-center justify-center gap-2 group hover:scale-105 hover:shadow-md transition-all hover:bg-[#d99221] hover:border-none">
              <span title="ویرایش">
                <BiIcon.BiEditAlt className="text-gray-400 group-hover:text-white" />
              </span>
              {/* <div className="text-sm">ویرایش</div> */}
            </button>
            {props.userRole === Role.ADMIN ||
              (props.userRole === Role.OWNER && (
                <button
                  title="حذف"
                  className="border flex flex-row gap-2 py-2 px-2 rounded-full item-center justify-center group hover:scale-105 hover:shadow-md transition-all hover:bg-red-700 hover:border-none"
                >
                  <span>
                    <MdIcon.MdDeleteForever className="text-gray-400 group-hover:text-white" />
                  </span>
                  {/* <div className="text-sm">حذف</div> */}
                </button>
              ))}
            {/* <span className="text-2xl font-bold">
                {(150000000).toLocaleString("fa-ir")}
              </span>
              <span>تومان</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstateCardDashboard;
