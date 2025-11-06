import React from "react";
import { motion } from "framer-motion";
import { Estate } from "../../../global/types/Estate";
import { EstateCard, EstateCardSkeleton } from "../../Estatecard/estatecard";
import { parseEstateToCard } from "../../../services/utilities/estateparser";

const NewViewHouses: React.FC<{ allestates?: Estate[] }> = ({ allestates }) => {
  // وقتی هنوز داده نیومده → اسکلت لودینگ نشون بده
  if (allestates === undefined) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <EstateCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // وقتی داده اومده ولی خالیه
  if (allestates.length === 0) {
    return (
      <div className="alertBox text-center p-6 text-gray-600">
        ملکی با این مشخصات یافت نشد 😔
      </div>
    );
  }

  // انیمیشن کلی برای کارت‌ها
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="
        grid gap-6
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4
        auto-rows-[minmax(380px,1fr)]
        px-2 md:px-0
      "
    >
      {allestates.map((estate) => {
        const cardData = parseEstateToCard(estate);
        return (
          <motion.div key={cardData.id} variants={cardVariants}>
            <EstateCard {...cardData} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default NewViewHouses;
