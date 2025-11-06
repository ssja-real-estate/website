import Link from "next/link";
import Image from "next/image";
import { EstateCardProps } from "../../global/types/estatecard";
import React from "react";

// حالت اسکلت بارگذاری
export const EstateCardSkeleton: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => (
  <div
    className={`
      animate-pulse bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden
      ${isMobile ? "flex flex-row h-[160px]" : "flex flex-col h-[420px]"}
    `}
  >
    <div className={`${isMobile ? "w-40 h-full" : "h-[220px] w-full"} bg-gray-200`} />
    <div className="p-4 space-y-3 flex-1">
      <div className="bg-gray-200 h-4 w-2/3 rounded" />
      <div className="bg-gray-200 h-3 w-1/2 rounded" />
      <div className="bg-gray-200 h-3 w-1/3 rounded" />
    </div>
  </div>
);

export const EstateCard: React.FC<EstateCardProps & { isMobile?: boolean }> = ({
  id,
  title,
  address,
  prices,
  images,
  phone,
  isMobile = false,
}) => {
  const imageSrc =
    images?.length && images[0]
      ? `https://ssja.ir/api/images/${id}/${images[0]}`
      : "/image/blankImage/bl.jpg";

  const phoneDisplay = phone || "۰۹*********";

  return (
    <Link
      href={`/estate/${id}`}
      rel="noopener noreferrer"
      target="_blank"
      className="block"
    >
      <article
        dir="rtl"
        className={`
          overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm
          hover:shadow-lg hover:-translate-y-1 transition-all duration-300
          ${isMobile ? "flex flex-row h-[160px]" : "flex flex-col h-[420px]"}
        `}
      >
        {/* عکس ملک */}
        <figure
          className={`
            relative overflow-hidden bg-gray-100 flex-shrink-0
            ${isMobile ? "w-40 h-full" : "w-full h-[220px]"}
          `}
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 160px, 33vw"
          />
        </figure>

        {/* محتوا */}
        <div className="flex flex-col justify-between flex-1 p-3 md:p-4 space-y-2">
          <div>
            <h2 className="text-base font-semibold text-slate-800 line-clamp-2">{title}</h2>
            <p className="text-xs text-gray-600 line-clamp-2">{address}</p>

            {prices?.length > 0 && (
              <div className="mt-1 space-y-1 text-xs">
                {prices.map(({ label, amount }) => (
                  <div key={label} className="flex items-center gap-1">
                    <span className="font-medium">{label}:</span>
                    <span className="font-semibold text-emerald-600">
                      {new Intl.NumberFormat("fa-IR").format(amount)} تومان
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* شماره تماس */}
          <div
            dir="ltr"
            className="border-t pt-2 mt-2 text-start text-sm font-medium tracking-widest text-gray-700"
          >
            {phoneDisplay}
          </div>
        </div>
      </article>
    </Link>
  );
};
