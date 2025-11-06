import Link from "next/link";
import Image from "next/image";
import { EstateCardProps } from "../../global/types/estatecard";
import React from "react";

// حالت Skeleton Loader برای زمان بارگذاری
export const EstateCardSkeleton: React.FC = () => (
  <div
    className="
      animate-pulse bg-white border border-gray-200 rounded-2xl shadow-sm
      overflow-hidden flex flex-col sm:flex-row
    "
  >
    <div className="bg-gray-200 h-[220px] sm:h-auto sm:w-40 w-full" />
    <div className="flex flex-col justify-between flex-1 p-4 space-y-2">
      <div className="space-y-3">
        <div className="bg-gray-200 h-4 w-2/3 rounded" />
        <div className="bg-gray-200 h-3 w-5/6 rounded" />
        <div className="bg-gray-200 h-3 w-3/4 rounded" />
      </div>
      <div className="border-t mt-4 pt-3">
        <div className="bg-gray-200 h-4 w-1/3 rounded" />
      </div>
    </div>
  </div>
);

export const EstateCard: React.FC<EstateCardProps> = ({
  id,
  title,
  address,
  prices,
  images,
  phone,
}) => {
  const imageSrc =
    images?.length
      ? `https://ssja.ir/api/images/${id}/${images[0]}`
      : "/image/blankImage/bl.jpg";

  const phoneDisplay = phone || "۰۹*********";

  return (
    <Link
      href={`/estate/${id}`}
      rel="noopener noreferrer"
      target="_blank"
      className="
        block bg-white border border-gray-200 rounded-2xl shadow-sm
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300
        overflow-hidden
      "
    >
      {/* در موبایل flex-row و در دسکتاپ flex-col */}
      <article
        dir="rtl"
        className="flex flex-col sm:flex-row md:flex-col h-full"
      >
        {/* تصویر ملک */}
        <figure
          className="
            relative 
            w-full md:w-full sm:w-40 sm:h-auto h-[220px]
            flex-shrink-0 overflow-hidden
          "
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            className="object-cover sm:static sm:h-full sm:w-40 group-hover:scale-105 transition-transform duration-500"
          />
          <div
            className="
              absolute top-2 left-2 bg-emerald-600 text-white text-xs px-3 py-1 
              rounded-full shadow
            "
          >
            آگهی ویژه
          </div>
        </figure>

        {/* محتوای کارت */}
        <div
          className="
            flex flex-col justify-between flex-1 
            p-4 space-y-2 md:space-y-3
          "
        >
          {/* عنوان و آدرس */}
          <div>
            <h2
              className="
                text-base font-semibold text-slate-800 line-clamp-2 
                hover:text-emerald-600 transition-colors
              "
            >
              {title}
            </h2>
            <p className="text-xs text-gray-600 line-clamp-3 mt-1">
              {address}
            </p>

            {/* قیمت‌ها */}
            {prices?.length > 0 && (
              <div className="space-y-1 text-xs mt-2">
                {prices.map(({ label, amount }) => (
                  <div key={label} className="flex items-center gap-1">
                    <span className="font-medium">{label}:</span>
                    <span className="text-emerald-600 font-semibold">
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
            className="
              border-t pt-3 text-start text-sm font-medium tracking-widest 
              text-gray-700 hover:text-emerald-700 transition-colors
            "
          >
            {phoneDisplay}
          </div>
        </div>
      </article>
    </Link>
  );
};
