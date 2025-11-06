import React from "react";
import { motion } from "framer-motion";
import { Estate } from "../../../global/types/Estate";
import { EstateCard, EstateCardSkeleton } from "../../Estatecard/estatecard";
import { parseEstateToCard } from "../../../services/utilities/estateparser";

const NewViewHouses: React.FC<{ allestates?: Estate[]; isMobile?: boolean }> = ({
  allestates,
  isMobile = false,
}) => {
  if (allestates === undefined) {
    // حالت اسکلت لودینگ
    return (
      <div
        className={
          isMobile
            ? "flex flex-col gap-4"
            : "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
        }
      >
        {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
          <EstateCardSkeleton key={i} isMobile={isMobile} />
        ))}
      </div>
    );
  }

  if (allestates.length === 0) {
    return (
      <div className="text-center p-6 text-gray-600">ملکی با این مشخصات یافت نشد 😔</div>
    );
  }

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
      className={
        isMobile
          ? "flex flex-col gap-4"
          : "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-[minmax(420px,1fr)]"
      }
    >
      {allestates.map((estate) => {
        const cardData = parseEstateToCard(estate);
        return (
          <motion.div key={cardData.id} variants={cardVariants}>
            <EstateCard {...cardData} isMobile={isMobile} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default NewViewHouses;
