import Image from "next/image";
import React from "react";
import RealEastate from "../../../data/models/real-estate";
import { Estate } from "../../../global/types/Estate";
import RealEstateCard from "../real-estate-card/RealEstateCard";

const NewViewHouses: React.FC<{
  allestates?: Estate[];
}> = (props) => {
  return (
    <div className="container grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4 mb-20">
      {props.allestates?.map((estate) => (
        <RealEstateCard key={estate.id} estates={estate} />
      ))}
    </div>
  );
};

export default NewViewHouses;
