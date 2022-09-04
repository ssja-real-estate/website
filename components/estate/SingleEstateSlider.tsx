import { FC, MutableRefObject, useEffect, useState } from "react";
import {
  useKeenSlider,
  KeenSliderPlugin,
  KeenSliderInstance,
} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import * as IoIcon from "react-icons/io5";

function ThumbnailPlugin(
  mainRef: MutableRefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("activeThumbnail");
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("activeThumbnail");
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on("created", () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main: any) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(next);
      });
    });
  };
}
function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
}) {
  const disabeld = props.disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? "arrow--left" : "arrow--right"
      } ${disabeld}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}
const SingleEstateSlider: FC<{ images: string[]; id: string }> = (props) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        // setLoaded(true);
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  if (props.images === undefined || props.images.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center border-[10px] border-white rounded-2xl shadow-xl">
        <IoIcon.IoImageOutline className="text-8xl text-gray-300" />
        <div className="text-gray-300">هیج عکسی درج نشده است</div>
      </div>
    );
  }
  return (
    <>
      <div className="navigation-wrapper  border-[10px] border-white rounded-2xl shadow-xl">
        <div ref={sliderRef} className="keen-slider">
          {props.images.map((img, index) => (
            <div key={index} className="keen-slider__slide number-slide1">
              <Image
                src={`https://ssja.ir/api/images/${props.id}/${img}`}
                alt="photo"
                width={1280}
                height={720}
                layout="responsive"
              />
            </div>
          ))}
          {/* <div className="keen-slider__slide number-slide1">
            <Image
              src="/image/estate/t1.jpg"
              alt="photo"
              width={1280}
              height={720}
              layout="responsive"
            />
          </div> */}
        </div>

        <div ref={thumbnailRef} className="keen-slider thumbnail mt-1 h-16">
          {props.images.map((img, index) => (
            <div key={index} className="keen-slider__slide cursor-pointer ">
              <Image
                src={`https://ssja.ir/api/images/${props.id}/${img}`}
                alt="photo"
                objectFit="cover"
                objectPosition="center"
                layout="fill"
              />
            </div>
          ))}
          {/* <div className="keen-slider__slide number-slide1 cursor-pointer ">
            <Image
              src="/image/estate/t1.jpg"
              alt="photo"
              objectFit="cover"
              objectPosition="center"
              layout="fill"
            />
          </div>
          <div className="keen-slider__slide number-slide2 cursor-pointer">
            <Image
              src="/image/estate/t2.jpg"
              alt="photo"
              objectFit="cover"
              objectPosition="center"
              layout="fill"
            />
          </div>
          <div className="keen-slider__slide number-slide3 cursor-pointer">
            <Image
              src="/image/estate/t3.jpg"
              alt="photo"
              objectFit="cover"
              objectPosition="center"
              layout="fill"
            />
          </div>
          <div className="keen-slider__slide number-slide4 cursor-pointer">
            <Image
              src="/image/estate/t4.jpg"
              alt="photo"
              objectFit="cover"
              objectPosition="center"
              layout="fill"
            />
          </div>
          <div className="keen-slider__slide number-slide5 cursor-pointer">
            <Image
              src="/image/estate/t5.jpg"
              alt="photo"
              objectFit="cover"
              objectPosition="center"
              layout="fill"
            />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default SingleEstateSlider;
