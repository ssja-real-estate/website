// components/EstateCard.tsx
import Link from "next/link";
import Image from "next/image";
import { EstateCardProps } from "../../global/types/estatecard";

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

  const phoneDisplay = phone ? phone : "۰۹*********";

  return (
    <Link href={`/estate/${id}`} className="block" rel="noopener noreferrer" target="_blank">
      <article
        dir="rtl"
        className="flex flex-col h-[400px] overflow-hidden rounded-lg border bg-white shadow-sm"
      >
        {/* عکس بالا */}
        <figure className="relative h-[200px] w-full">
          <Image src={imageSrc} alt={title} fill priority className="object-cover" />
        </figure>

        {/* محتوای میانی (عنوان، آدرس، قیمت‌ها) */}
        <div className="flex flex-col flex-1 overflow-auto p-4 space-y-2">
          <h2 className="text-base font-semibold line-clamp-2">{title}</h2>
          <p className="text-xs text-gray-600 line-clamp-3">{address}</p>

          {prices?.length > 0 && (
            <div className="space-y-1 text-xs">
              {prices.map(({ label, amount }) => (
                <div key={label} className="flex items-center gap-1">
                  <span className="font-medium">{label}:</span>
                  <span className="text-emerald-600">
                    {new Intl.NumberFormat("fa-IR").format(amount)}&nbsp;تومان
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* شماره تماس در پایین کارت */}
        <div dir="ltr" className="p-4  border-t text-start   text-sm font-medium tracking-widest">
          {phoneDisplay}
        </div>
      </article>
    </Link>
  );
};
