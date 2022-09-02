import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { globalState } from "../../global/states/globalStates";
import { defaultEstate, Estate } from "../../global/types/Estate";
import { Field, FieldType } from "../../global/types/Field";
import EstateService from "../../services/api/EstateService/EstateService";
import SingleEstateSlider from "../estate/SingleEstateSlider";

const ImageEstate: FC<{ field: Field[]; id: string }> = (props) => {
  const [images, setImages] = useState<string[]>();
  useEffect(() => {
    props.field.map((f) => {
      if (f.type === FieldType.Image && f.value) {
        setImages(f.value as string[]);
      }
    });
  });

  return (
    <div>
      <SingleEstateSlider images={images as string[]} id={props.id} />
      {/* {images?.map((img, index) => (
        <Image
          key={index}
          src={`https://ssja.ir/api/images/${props.id}/${img}`}
          width={720}
          height={1290}
          alt="estate image"
        />
      ))} */}
    </div>
  );
};

export default ImageEstate;
