import { EstateCardProps } from "../../global/types/estatecard";
import Image from 'next/image';
export const EstateCard: React.FC<EstateCardProps> = ({
    id,
    title,
    address,
    prices,
    images,
  }) => (
    <article
      key={id}
      dir="rtl"
      className="overflow-hidden rounded-lg border bg-white shadow-sm"
    >
      {/* تصویر شاخص */}
      {images?.[0] && (
        <figure className="relative w-full pb-[56.25%]">
          <Image
            src={`https://ssja.ir/api/images/${id}/${images[0]}`}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        </figure>
      )}
  
      {/* محتوا */}
      <div className="space-y-2 p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{address}</p>
  
        {/* فهرست قیمت‌ها (ممکن است بیش از یکی باشد) */}
        {prices?.length > 0 && (
          <div className="mt-3 space-y-1">
            {prices.map(({ label, amount }) => (
              <div key={label} className="flex items-center gap-1 text-sm">
                <span className="font-medium">{label}:</span>
                <span className="text-emerald-600">
                  {new Intl.NumberFormat('fa-IR').format(amount)} تومان
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );