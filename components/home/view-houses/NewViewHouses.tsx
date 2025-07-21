import React from "react";
import { Estate } from "../../../global/types/Estate";
import RealEstateCard from "../real-estate-card/RealEstateCard";
import { EstateCard } from "../../Estatecard/estatecard";
import { parseEstateToCard } from "../../../services/utilities/estateparser";

const NewViewHouses: React.FC<{
  allestates?: Estate[];
}> = (props) => {
 
  if (props.allestates?.length === 0) {
    return <div className="alertBox">ملکی با این مشخصات یافت نشد!!!</div>;
  }
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-4 mb-20">
      {props.allestates?.map(estate => {
  const cardData = parseEstateToCard(estate);

  return <EstateCard key={cardData.id} {...cardData} />;
})}

    </div>
  );
};

export default NewViewHouses;
