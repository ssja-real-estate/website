import Image from "next/image";
import React from "react";
import RealEastate from "../../../data/models/real-estate";
import RealEstateCard from "../real-estate-card/RealEstateCard";

const NewViewHouses: React.FC<{
  all: RealEastate[];
}> = (props) => {
  return (
    <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
      {props.all.map((realEstate) => (
        <RealEstateCard key={realEstate.id} realEastate={realEstate} />
      ))}
    </div>
  );
};

export default NewViewHouses;
