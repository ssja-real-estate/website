import Image, { ImageLoader, StaticImageData } from "next/image";
import { FC, MouseEventHandler, useEffect, useState } from "react";
import { Estate } from "../../../global/types/Estate";
import { Role, roleMap } from "../../../global/types/User";
import * as BiIcon from "react-icons/bi";
import * as MdIcon from "react-icons/md";
import * as BsIcon from "react-icons/bs";
import * as VsIcon from "react-icons/vsc";
import { FieldType } from "../../../global/types/Field";

import LabelStatusEstatecard from "./LabelStatusEstatecard";
import Link from "next/link";
// const img:ImageLoader = {
//   src: any;
//   width: any;
//   quality: any;
// };
interface EstateCardProps {
  estate: Estate;
  editButton?: boolean;
  verifyButton?: boolean;
  rejectButton?: boolean;
  showEstateInfoButton?: boolean;
  showBadge?: boolean;
  onEdit?: MouseEventHandler;
  onVerify?: MouseEventHandler;
  onReject?: MouseEventHandler;
  onShowEstateInfo?: MouseEventHandler;
  onCloseEstateInfo?: () => void;
}
const EstateCardDashboard: FC<EstateCardProps> = (props) => {
  // const [src, setSrc] = useState<string | StaticImageData>("");
  // useEffect(() => {
  //   setSrc(imageFromPropsEstate());
  // }, [src]);

  const myLoader: ImageLoader = ({ src, width, quality }) => {
    return `https://ssja.ir/api/images/${src}?w=${width}&q=${quality || 100}`;
  }; //don't use myLoader function

  function imageFromPropsEstate(): string {
    let srcset = "/image/blankImage/bl.jpg";
    props.estate.dataForm.fields.map((es) => {
      if (es.type === FieldType.Image && (es.value as []).length > 0) {
        srcset = `https://ssja.ir/api/images/${props.estate.id}/${String(
          (es.value as []).at(0)
        )}`;
      }
    });

    return srcset;
  }

  return (
    <div className="w-full rounded-md overflow-hidden shadow-md relative">
      <LabelStatusEstatecard estatStatus={props.estate.estateStatus.status} />
      <Image
        // loader={myLoader}
        // src={`https://ssja.ir/api/images/${props.estate.id}/${imageFromPropsEstate}`}
        src={imageFromPropsEstate()}
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
          {/* <a
            target="_blank"
            href={`/estate/${props.estate.id}`}
            rel="noreferrer"
            className="flex flex-row border py-2 px-2 rounded-full item-center justify-center gap-2 group hover:scale-105 hover:shadow-md transition-all hover:bg-[#0ba] hover:border-none"
          >
            <span title="اطلاعات کامل ملک">
              <BsIcon.BsInfoCircleFill className="text-gray-400 group-hover:text-white" />
            </span>
          </a> */}
          <Link target="_blank" href={`/estate/${props.estate.id}`}>
            <div className="flex flex-row border py-2 px-2 rounded-full item-center justify-center gap-2 group hover:scale-105 hover:shadow-md transition-all hover:bg-[#0ba] hover:border-none hover:cursor-pointer">
              <span title="اطلاعات کامل ملک">
                <BsIcon.BsInfoCircleFill className="text-gray-400 group-hover:text-white" />
              </span>
            </div>
          </Link>
          <div className="flex flex-row gap-2 items-end">
            {props.editButton && (
              <button
                onClick={props.onEdit}
                className="flex flex-row border py-2 px-2 rounded-full item-center justify-center gap-2 group hover:scale-105 hover:shadow-md transition-all hover:bg-[#d99221] hover:border-none"
              >
                <span title="ویرایش">
                  <BiIcon.BiEditAlt className="text-gray-400 group-hover:text-white" />
                </span>
                {/* <div className="text-sm">ویرایش</div> */}
              </button>
            )}
            {props.verifyButton && (
              <button
                onClick={props.onVerify}
                className="flex flex-row border py-2 px-2 rounded-full item-center justify-center gap-2 group hover:scale-105 shadow-sm shadow-green-500 border-green-500 transition-all hover:bg-green-600 hover:border-none"
              >
                <span title="تأیید ملک">
                  <MdIcon.MdCheck className="text-green-600 group-hover:text-white" />
                </span>
                {/* <div className="text-sm">ویرایش</div> */}
              </button>
            )}
            {props.rejectButton && (
              <button
                onClick={props.onReject}
                className="flex flex-row border border-red-700 py-2 px-2 rounded-full item-center justify-center gap-2 group hover:scale-105 shadow-sm shadow-red-700 transition-all hover:bg-red-700 hover:border-none"
              >
                <span title="عدم تأیید ملک">
                  <VsIcon.VscClose className="text-red-700 group-hover:text-white" />
                </span>
                {/* <div className="text-sm">ویرایش</div> */}
              </button>
            )}

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
