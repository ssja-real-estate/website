import Strings from "global/constants/strings";
import { FieldType } from "global/types/Field";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { estateInfoModalAtom } from "./EstateInfoModalState";

const imagesBaseUrl = "https://ssja.ir/api/images";

const EstateInfoModal = () => {
  const estateInfo = useRecoilValue(estateInfoModalAtom);
  const [hasImageSection, setHasImageSection] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const mounted = useRef(true);

  useEffect(() => {
    if (mounted) {
      checkImageSection();
    }

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkImageSection = () => {
    const sections = estateInfo.estate.dataForm.sections;
    if (sections.length < 1) return;

    const firstSection = sections[0];
    const firstSectionFields = firstSection.fields;
    if (firstSectionFields.length < 1) return;

    const firstField = firstSectionFields[0];
    if (!firstField || firstField.type !== FieldType.Image) return;

    const includesImages = (firstField.value as string[]).length > 0;
    setHasImageSection(includesImages);

    if (includesImages) {
      const images: string[] = [];
      (firstField.value as string[]).forEach((image) => {
        images.push(`${imagesBaseUrl}/${image}`);
      });
      setImages(images);
    }
  };

  return (
    <div>
      {hasImageSection && (
        <div>
          <h3>{Strings.images}</h3>
          <div>
            {images.map((imageAddress) => (
              <p>{imageAddress}</p>
            ))}
          </div>
        </div>
      )}
      <div>{estateInfo.estate.dataForm.title}</div>
      <div>
        <div>{Strings.province}</div>
        <div>{estateInfo.estate.province.name}</div>
      </div>
      <div>
        <div>{Strings.city}</div>
        <div>{estateInfo.estate.city.name}</div>
      </div>
      <div>
        <div>{Strings.neighborhood}</div>
        <div>{estateInfo.estate.neighborhood.name}</div>
      </div>
    </div>
  );
};

export default EstateInfoModal;
