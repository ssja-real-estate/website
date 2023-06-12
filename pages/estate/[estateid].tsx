import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import MultiSelectView from "../../components/estate/MultiSelectView";
import ImageEstate from "../../components/ImageEstate/ImageEstate";
import SsjaMapTest from "../../components/map-component/SsjaMapTest";
import Spiner from "../../components/spinner/Spiner";
import { globalState } from "../../global/states/globalStates";
import { defaultEstate, Estate } from "../../global/types/Estate";
import { Field, FieldType } from "../../global/types/Field";
import { defaultMapInfo } from "../../global/types/MapInfo";
import EstateService from "../../services/api/EstateService/EstateService";
import { useRouter } from "next/router";
const Property = () => {
  const router = useRouter();
  const estateService = useRef(new EstateService());
  const state = useRecoilValue(globalState);
  const [estate, setEstate] = useState<Estate>(defaultEstate);
  const [loaded, setLoaded] = useState(false);
  const mounted = useRef(true);
  // const [images, setImages] = useState<string[]>();

  useEffect(() => {
    estateService.current.setToken(state.token);
    return () => {
      mounted.current = false;
    };
  }, [state.token]);
  useEffect(() => {
    loadEstate(router.query.estateid as string);
    setLoaded(true);
    return () => {
      mounted.current = false;
    };
  }, [router.query, loaded]);
  const loadEstate = async (id: string) => {
    console.log(id);

    await estateService.current
      .getEstateById(id)
      .then((estate) => {
        console.log("estate: ");
        console.log(estate);

        setEstate(estate);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const myLoader = ({ src: string, width: numver, quality: number }) => {
  //   return `https://ssja.com/api/images/${src}?w=${width}&q=${quality || 75}`;
  // };
  function parseField(value: object) {
    let oprions: [] = [];
    (Object.keys(value) as (keyof typeof value)[]).forEach((key, index) => {
      // 👇️ name Tom 0, country Chile 1
      // console.log(key, value[key], index);
      if (value[key]) {
        oprions.push(key);
      }
    });

    return oprions;
    // return oprions.map((option, index) => (
    //   <div key={index} className="hidden group-focus-within:block">
    //     {option}
    //   </div>
    // ));
  }
  function mapField(estate: Field[]) {
    return estate.map((field, index) => {
      switch (field.type) {
        case FieldType.Text:
          return (
            <li
              key={index}
              className="flex flex-row gap-2 w-full items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full"
            >
              <span>{field.title}</span> : <span>{field.value as string}</span>
            </li>
          );

        case FieldType.Number:
          return (
            <li
              key={index}
              className="flex flex-row gap-2 w-full items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full"
            >
              <span>{field.title}</span> :
              <span>{Number(field.value).toLocaleString("fa-ir")}</span>
            </li>
          );

        case FieldType.Select:
          return (
            <li
              key={index}
              className="flex flex-row gap-2 w-full items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full"
            >
              <span>{field.title}</span> :<span>{field.value.toString()}</span>
            </li>
          );

        case FieldType.Bool:
          return (
            <li
              key={index}
              className="flex flex-row gap-2 w-full items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full"
            >
              3
            </li>
          );

        case FieldType.BooleanConditional:
          return (
            <li
              key={index}
              className="flex flex-row gap-2 w-full items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full"
            >
              <span>{field.title}</span> :
              <span>{(field.value as boolean) ? "دارد" : "ندارد"}</span>
            </li>
          );

        case FieldType.Image:
          // setImages(field.value as string[]);
          return (
            <li key={index}></li>
            // <li key={index} className="">
            //   {(field.value as string[]).map((img, index) => (
            //     <ImageEstate
            //       key={index}
            //       imgSrc={`https://ssja.ir/api/images/${props.id}/${img}`}
            //     />
            //   ))}
            // </li>
            // <Image
            //   key={index}
            //   width={720}
            //   height={1280}
            //   src={`https://ssja.ir/api/images/${props.id}/${img}`}
            //   alt="img"
            // />
          );

        case FieldType.Range:
          return (
            <li
              key={index}
              className="flex flex-row gap-2 w-full items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full"
            ></li>
          );

        case FieldType.SelectiveConditional:
          return (
            <li
              key={index}
              className="flex flex-row gap-2 w-full items-center before:block before:w-2 before:h-2 before:border-2 before:border-[#0ba] before:rounded-full"
            >
              <span>{field.title}</span> : <span>{field.value as string}</span>
            </li>
          );

        case FieldType.MultiSelect:
          return (
            // <li key={index} className="group">
            //   <span>{field.title}</span> :
            //   <span className="hidden group-focus-within:block">
            //     {parseField(field.value as object)}
            //   </span>
            // </li>
            <MultiSelectView
              key={index}
              title={field.title}
              options={parseField(field.value as object)}
            />
          );

        case FieldType.Price:
          return (
            <li key={index} className="">
              9
            </li>
          );
      }
    });
  }
  if (!loaded) {
    return <Spiner />;
  }
  return (
    <div className="container mb-16">
      <div className="">
        <h1 className="text-[#2c3e50] font-bold text-[30px]">
          {estate.province.name}
        </h1>
        <h3 className="text-[#2c3e50] font-thin text-[20px]">
          {estate.city.name + "، " + estate.neighborhood.name}
        </h3>
      </div>
      <div className="h-[1px] my-3 bg-gray-300 w-full"></div>
      {/* <div className="py-5">
        <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center justify-between">
          <div className="bg-white border py-4 border-[#d6d6d6] p-2 text-[#0ba] text-[30px] flex items-center justify-center gap-2">
            <span>{(2354654125).toLocaleString("fa-ir")}</span>
            <span className="text-sm">تومان</span>
          </div>
          <div className="flex flex-row gap-3">
            <button className="border-2 w-full sm:w-40  text-[#2c3e50]  border-[#2c3e50] flex items-center justify-center py-2 px-4 gap-1 hover:text-[#f3bc65] hover:border-[#f3bc65]">
              <span>مورد علاقه من</span>
              <AiIcon.AiFillStar />
            </button>
            <button className="border-2 w-full sm:w-40 text-[#2c3e50]  border-[#2c3e50] flex items-center justify-center py-2 px-4 gap-1 hover:text-[#f3bc65] hover:border-[#f3bc65]">
              <span>بروز رسانی </span>
              <BiIcon.BiRefresh className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-8">
        <div className="">
          <h2 className="font-bold text-[#2c3e50] text-lg">
            <span>مشخصات جهت </span>
            <span>{estate.dataForm.title}</span>
          </h2>
          <div className="mt-3 items-center">
            <ul className="flex flex-col gap-3 text-[#2c3e50] text-sm">
              {mapField(estate.dataForm.fields)}
            </ul>
          </div>
        </div>
        <div className="">
          <ImageEstate
            field={estate.dataForm.fields}
            id={router.query.estateid as string}
          />
        </div>
      </div>
      <div className="h-64 mt-14">
        <h2 className="text-[#2c3e50] font-bold text-lg my-2">نقشه ملک</h2>
        <SsjaMapTest cordinate={defaultMapInfo} isDragable={false} />
      </div>
    </div>
  );
};
export default Property;
