import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { useRecoilValue } from "recoil";
import { Autoplay, Pagination, Navigation } from "swiper";
import Image from "next/image";
import { Slider } from "../../../global/types/slider";
import SliderService from "../../../services/api/SliderService/SliderService";
import { globalState } from "../../../global/states/globalStates";
function CarsoulSlider() {
  const state = useRecoilValue(globalState);
  const[sliders,setSliders]=useState<Slider[]>([])
  const sliderService=useRef( new SliderService())
  const getSliders=async() => {
    sliderService.current.getSlider().then((value:Slider[]) => {
      setSliders(value);
     
  })
 }
     useEffect(()=>{
  
        sliderService.current.setToken(state.token)
        getSliders();
     },[])
  return (
    <div className="container mt-5 sm:mt-0">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {
          sliders.map((item:Slider,index:number)=>
            <SwiperSlide key={index}>
          <div>
            <Image
              src={`https://ssja.ir/api/slider/${item.path}`}
              alt="home"
              layout="responsive"
              width={2000}
              height={500}
              priority={true}
            />
          </div>
        </SwiperSlide>
          )
        }
     
        
       
      </Swiper>
    </div>
  );
}

export default CarsoulSlider;
