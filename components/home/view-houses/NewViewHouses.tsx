import React from "react";
import { Estate } from "../../../global/types/Estate";
import RealEstateCard from "../real-estate-card/RealEstateCard";

const NewViewHouses: React.FC<{
  allestates?: Estate[];
}> = (props) => {
  console.log(props.allestates);
  if (props.allestates?.length === 0) {
    return <div className="alertBox">ملکی با این مشخصات یافت نشد!!!</div>;
  }
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4 mb-20">
      {props.allestates?.map((estate) => (
        <RealEstateCard key={estate.id} estates={estate} />
      ))}
    </div>
  );
};

export default NewViewHouses;
