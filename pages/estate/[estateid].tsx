// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/router";
// import { useRecoilValue } from "recoil";

// /* ────────────────  Components  ──────────────── */
// import MultiSelectView from "../../components/estate/MultiSelectView";
// import ImageEstate from "../../components/ImageEstate/ImageEstate";
// import SsjaMapTest from "../../components/map-component/SsjaMapTest";
// import Spiner from "../../components/spinner/Spiner";

// /* ────────────────  Global state & types  ─────── */
// import { globalState } from "../../global/states/globalStates";
// import { defaultEstate, Estate } from "../../global/types/Estate";
// import { Field, FieldType } from "../../global/types/Field";
// import { defaultMapInfo } from "../../global/types/MapInfo";

// /* ────────────────  API service  ──────────────── */
// import EstateService from "../../services/api/EstateService/EstateService";

// const Property = () => {
//   /* ───────── basic hooks ───────── */
//   const router = useRouter();
//   const state = useRecoilValue(globalState);

//   /* ───────── service instance ───── */
//   const estateService = useRef(new EstateService());

//   /* ───────── local state ────────── */
//   const [estate, setEstate]   = useState<Estate>(defaultEstate);
//   const [loaded, setLoaded]   = useState(false);

//   /* ───────── set / clear token ──── */
//   useEffect(() => {
//     if (state.token) {
//       estateService.current.setToken(state.token);
//       // هِدِر را کاملاً حذف کن
//     }
//   }, [state.token]);

//   /* ───────── fetch estate once ──── */
//   useEffect(() => {
//     if (!router.isReady) return;

//     const id = router.query.estateid as string | undefined;
//     if (!id) return;

//     (async () => {
//       try {
//         const data = await estateService.current.getEstateById(id);
//         setEstate(data);
//         setLoaded(true);
//       } catch (err) {
//         console.error(err);
//         // در صورت نیاز ریدایرکت یا نوتیفیکیشن خطا
//       }
//     })();
//   }, [router.isReady, router.query.estateid]);

//   /* ───────── helpers ────────────── */
//   const parseField = (fieldOptions: { Key: string; Value: boolean }[]) =>
//     fieldOptions.filter(o => o.Value).map(o => o.Key);

//   const mapField = (fields: Field[]) =>
//     fields.map((field, idx) => {
//       switch (field.type) {
//         case FieldType.Text:
//           return (
//             <li key={idx} className="flex gap-2 items-center before:dot">
//               <span>{field.title}</span> : <span>{field.value as string}</span>
//             </li>
//           );
//         case FieldType.Number:
//           return (
//             <li key={idx} className="flex gap-2 items-center before:dot">
//               <span>{field.title}</span> :
//               <span>{Number(field.value).toLocaleString("fa-ir")}</span>
//             </li>
//           );
//         case FieldType.Select:
//           return (
//             <li key={idx} className="flex gap-2 items-center before:dot">
//               <span>{field.title}</span> :<span>{field.value.toString()}</span>
//             </li>
//           );
//         case FieldType.Bool:
//         case FieldType.BooleanConditional:
//           return (
//             <li key={idx} className="flex gap-2 items-center before:dot">
//               <span>{field.title}</span> :
//               <span>{(field.value as boolean) ? "دارد" : "ندارد"}</span>
//             </li>
//           );
//         case FieldType.Image:
//           return null;                            // تصاویر را جداگانه رندر می‌کنیم
//         case FieldType.Range:
//           return (
//             <li key={idx} className="flex gap-2 items-center before:dot">
//               <span>{field.title}</span> :
//               <span>{(field.value as number[]).join(" - ")}</span>
//             </li>
//           );
//         case FieldType.SelectiveConditional:
//           return (
//             <li key={idx} className="flex gap-2 items-center before:dot">
//               <span>{field.title}</span> : <span>{field.value as string}</span>
//             </li>
//           );
//         case FieldType.MultiSelect:
//           return (
//             <MultiSelectView
//               key={idx}
//               title={field.title}
//               options={parseField((field.value as any[]) ?? [])}
//             />
//           );
//         case FieldType.Price:
//           return (
//             <li key={idx} className="flex gap-2 items-center before:dot">
//               <span>{field.title}</span> :
//               <span>{Number(field.value).toLocaleString("fa-ir")} تومان</span>
//             </li>
//           );
//       }
//     });

//   /* ───────── loading UI ─────────── */
//   if (!router.isReady || !loaded) return <Spiner />;

//   /* ───────── main render ────────── */
//   return (
//     <div className="container mb-16">
//       {/* ───── عنوان و آدرس ───── */}
//       <header className="mb-3">
//         <h1 className="text-[#2c3e50] font-bold text-2xl">
//           {estate.province.name}
//         </h1>
//         <h3 className="text-[#2c3e50] font-light">
//           {estate.city.name}، {estate.neighborhood.name}
//         </h3>
//       </header>

//       <hr className="my-3 border-gray-300" />

//       {/* ───── محتوا ───── */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-8">
//         {/* ─── ستون مشخصات ─── */}
//         <section>
//           <h2 className="font-bold text-[#2c3e50] text-lg">
//             مشخصات جهت {estate.dataForm.title}
//           </h2>

//           <ul className="mt-3 flex flex-col gap-3 text-[#2c3e50] text-sm">
//             {mapField(estate.dataForm.fields)}
//           </ul>

//           {/* تصاویر ملک */}
//           <div className="mt-8">
//             <ImageEstate
//               field={estate.dataForm.fields}
//               id={router.query.estateid as string}
//             />
//           </div>
//         </section>

//         {/* ─── ستون نقشه ─── */}
//         <section className="h-full">
//           <h2 className="text-[#2c3e50] font-bold text-lg mb-2">نقشه ملک</h2>
//           <SsjaMapTest cordinate={defaultMapInfo} isDragable={false} />
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Property;








// pages/estate/[estateid].tsx

// pages/estate/[estateid].tsx

import React from "react";
import { NextPage, GetServerSideProps } from "next";
import MultiSelectView from "../../components/estate/MultiSelectView";
import ImageEstate from "../../components/ImageEstate/ImageEstate";
import SsjaMapTest from "../../components/map-component/SsjaMapTest";
import EstateService from "../../services/api/EstateService/EstateService";
import { defaultMapInfo } from "../../global/types/MapInfo";
import { Field, FieldType } from "../../global/types/Field";
import { Estate } from "../../global/types/Estate";

interface Props {
  estate: Estate;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  // ۱) اعتبارسنجی پارامتر دینامیک
  const raw = params?.estateid;
  const estateid = Array.isArray(raw) ? raw[0] : raw;
  if (!estateid) {
    return { notFound: true };
  }

  // ۲) فراخوانی API (بدون هیچ ست‌کردن توکن)
  const estateService = new EstateService();
  try {
    const estate = await estateService.getEstateById(estateid);
    return { props: { estate } };
  } catch (error) {
    console.error("SSR fetch error:", error);
    return { notFound: true };
  }
};

const EstatePage: NextPage<Props> = ({ estate }) => {
  console.log(estate);
  const parseField = (opts: { Key: string; Value: boolean }[]): string[] =>
    opts.filter((o) => o.Value).map((o) => o.Key);

  const renderFields = (fields: Field[]) =>
    fields.map((field, idx) => {
      const baseCls = "flex gap-2 items-center before:dot";
      switch (field.type) {
        case FieldType.Text:
          return (
            <li key={idx} className={baseCls}>
              <span>{field.title}</span>: <span>{field.value as string}</span>
            </li>
          );
        case FieldType.Number:
          return (
            <li key={idx} className={baseCls}>
              <span>{field.title}</span>:{" "}
              <span>{Number(field.value).toLocaleString("fa-ir")}</span>
            </li>
          );
        case FieldType.Select:
          return (
            <li key={idx} className={baseCls}>
              <span>{field.title}</span>: <span>{String(field.value)}</span>
            </li>
          );
        case FieldType.Bool:
        case FieldType.BooleanConditional:
          return (
            <li key={idx} className={baseCls}>
              <span>{field.title}</span>:{" "}
              <span>{(field.value as boolean) ? "دارد" : "ندارد"}</span>
            </li>
          );
        case FieldType.Range:
          return (
            <li key={idx} className={baseCls}>
              <span>{field.title}</span>:{" "}
              <span>{(field.value as number[]).join(" - ")}</span>
            </li>
          );
        case FieldType.SelectiveConditional:
          return (
            <li key={idx} className={baseCls}>
              <span>{field.title}</span>: <span>{field.value as string}</span>
            </li>
          );
        case FieldType.MultiSelect:
          return (
            <MultiSelectView
              key={idx}
              title={field.title}
              options={parseField(field.value as any[])}
            />
          );
        case FieldType.Price:
          return (
            <li key={idx} className={baseCls}>
              <span>{field.title}</span>:{" "}
              <span>
                {Number(field.value).toLocaleString("fa-ir")} تومان
              </span>
            </li>
          );
        default:
          // FieldType.Image و بقیه را در ImageEstate هندل می‌کنیم
          return null;
      }
    });

  return (
    <div className="container mb-16">
      {/* عنوان و آدرس */}
      <header className="mb-3">
        <h1 className="text-[#2c3e50] font-bold text-2xl">
          {estate.province.name}
        </h1>
        <h3 className="text-[#2c3e50] font-light">
          {estate.city.name}، {estate.neighborhood.name}
        </h3>
      </header>

      <hr className="my-3 border-gray-300" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-8">
        {/* ستون مشخصات */}
        <section>
          <h2 className="font-bold text-[#2c3e50] text-lg">
            مشخصات جهت {estate.dataForm.title}
          </h2>
          <ul className="mt-3 flex flex-col gap-3 text-[#2c3e50] text-sm">
            {renderFields(estate.dataForm.fields)}
          </ul>
          <div className="mt-8">
            <ImageEstate field={estate.dataForm.fields} id={estate.id} />
          </div>
        </section>

        {/* ستون نقشه */}
        <section className="h-full">
          <h2 className="text-[#2c3e50] font-bold text-lg mb-2">
            نقشه ملک
          </h2>
          <SsjaMapTest cordinate={defaultMapInfo} isDragable={false} />
        </section>
      </div>
    </div>
  );
};

export default EstatePage;

