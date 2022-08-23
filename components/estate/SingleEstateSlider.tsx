import { FC, MutableRefObject } from "react";
import {
  useKeenSlider,
  KeenSliderPlugin,
  KeenSliderInstance,
} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
function ThumbnailPlugin(
  mainRef: MutableRefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("active");
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
const SingleEstateSlider: FC = () => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );
  return (
    <>
      <div ref={sliderRef} className="keen-slider">
        <div className="keen-slider__slide number-slide1">
          <Image
            src="/image/estate/t1.jpg"
            alt="photo"
            width={1280}
            height={720}
            layout="responsive"
          />
        </div>
        <div className="keen-slider__slide number-slide2">
          <Image
            src="/image/estate/t2.jpg"
            alt="photo"
            width={1280}
            height={720}
            layout="responsive"
          />
        </div>
        <div className="keen-slider__slide number-slide3">
          <Image
            src="/image/estate/t3.jpg"
            alt="photo"
            width={1280}
            height={720}
            layout="responsive"
          />
        </div>
        <div className="keen-slider__slide number-slide4">
          <Image
            src="/image/estate/t4.jpg"
            alt="photo"
            width={1280}
            height={720}
            layout="responsive"
          />
        </div>
        <div className="keen-slider__slide number-slide5">
          <Image
            src="/image/estate/t5.jpg"
            alt="photo"
            width={1280}
            height={720}
            layout="responsive"
          />
        </div>
      </div>

      <div ref={thumbnailRef} className="keen-slider thumbnail mt-1">
        <div className="keen-slider__slide number-slide1 cursor-pointer">
          <Image
            src="/image/estate/t1.jpg"
            alt="photo"
            width={703}
            height={500}
          />
        </div>
        <div className="keen-slider__slide number-slide2 cursor-pointer">
          <Image
            src="/image/estate/t2.jpg"
            alt="photo"
            width={703}
            height={500}
          />
        </div>
        <div className="keen-slider__slide number-slide3 cursor-pointer">
          <Image
            src="/image/estate/t3.jpg"
            alt="photo"
            width={703}
            height={500}
          />
        </div>
        <div className="keen-slider__slide number-slide4 cursor-pointer">
          <Image
            src="/image/estate/t4.jpg"
            alt="photo"
            width={703}
            height={500}
          />
        </div>
        <div className="keen-slider__slide number-slide5 cursor-pointer">
          <Image
            src="/image/estate/t5.jpg"
            alt="photo"
            width={703}
            height={500}
          />
        </div>
      </div>
    </>
  );
};

export default SingleEstateSlider;
