import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";
import Image from "next/image";

function CarsoulSlider() {
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
        <SwiperSlide>
          <div>
            <Image
              src="/slider/s1.jpg"
              alt="home"
              layout="responsive"
              width={2000}
              height={500}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div>
            <Image
              src="/slider/s2.jpg"
              alt="home"
              layout="responsive"
              width={2000}
              height={500}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div>
            <Image
              src="/slider/s3.jpg"
              alt="home"
              layout="responsive"
              width={2000}
              height={500}
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div>
            <Image
              src="/slider/s4.jpg"
              alt="home"
              layout="responsive"
              width={2000}
              height={500}
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default CarsoulSlider;
