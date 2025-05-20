// import Link from "next/link";
// import { EstateCardProps } from "../../global/types/estatecard";
// import Image from 'next/image';
// export const EstateCard: React.FC<EstateCardProps> = (
//   {
//     id,
//     title,
//     address,
//     prices,
//     images,
//   }

  
// ) => (
    
//     <Link
//     href={`/estate/${id}`}
//     rel="noopener noreferrer"
//     target="_blank"
//   >
//     <article
//       key={id}
//       dir="rtl"
//       className="overflow-hidden rounded-lg border bg-white shadow-sm"
//     >
//       {/* تصویر شاخص */}
//       {images?.[0] && (
//         <figure className="relative w-full pb-[56.25%]">
//           <Image
//             src={`https://ssja.ir/api/images/${id}/${images[0]}`}
//             alt={title}
//             fill
//             priority
//             className="object-cover"
//           />
//         </figure>
//       )}
  
//       {/* محتوا */}
//       <div className="space-y-2 p-4">
//         <h2 className="text-lg font-semibold">{title}</h2>
//         <p className="text-sm text-gray-600">{address}</p>
  
//         {/* فهرست قیمت‌ها (ممکن است بیش از یکی باشد) */}
//         {prices?.length > 0 && (
//           <div className="mt-3 space-y-1">
//             {prices.map(({ label, amount }) => (
//               <div key={label} className="flex items-center gap-1 text-sm">
//                 <span className="font-medium">{label}:</span>
//                 <span className="text-emerald-600">
//                   {new Intl.NumberFormat('fa-IR').format(amount)} تومان
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </article>
//     </Link>
//   );



import Link from "next/link";
import { EstateCardProps } from "../../global/types/estatecard";
import Image from 'next/image';

const DEFAULT_IMAGE = '/images/estate-placeholder.jpg';

export const EstateCard: React.FC<EstateCardProps> = ({
  id,
  title,
  address,
  prices,
  images,
}) => {
  const imageSrc =
    images && images.length > 0
      ? `https://ssja.ir/api/images/${id}/${images[0]}`
      : '/image/blankImage/bl.jpg';

  return (
    <Link href={`/estate/${id}`} rel="noopener noreferrer" target="_blank">
      <article
        key={id}
        dir="rtl"
        className="h-[360px] flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm"
      >
        {/* تصویر با ارتفاع ثابت */}
        <figure className="relative h-[200px] w-full"> {/* 40% of 360px */}
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        </figure>

        {/* محتوا */}
        <div className="flex-1 p-4 overflow-auto">
          <h2 className="text-lg font-semibold line-clamp-2">{title}</h2>
          <p className="mt-1 text-sm text-gray-600 line-clamp-3">{address}</p>

          {/* فهرست قیمت‌ها */}
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
    </Link>
  );
};
