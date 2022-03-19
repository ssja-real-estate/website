import Strings from "global/constants/strings";
import { imagesBaseUrl } from "global/states/GlobalState";
import { FieldType } from "global/types/Field";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { estateInfoModalAtom } from "./EstateInfoModalState";
import "./EstateInfoModal.css";
import { Col, Row } from "react-bootstrap";

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
        images.push(`${imagesBaseUrl}/${estateInfo.estate.id}/${image}`);
      });
      setImages(images);
    }
  };

  return (
    <Row>
      <Col>
        <h3 className="pt-3">{estateInfo.estate.dataForm.title}</h3>
        <h5 className="pt-3">
          {Strings.province} : {estateInfo.estate.province.name}
        </h5>
        <h5 className="pt-3">
          {Strings.city} : {estateInfo.estate.city.name}
        </h5>
        <h5 className="pt-3">
          {Strings.neighborhood} : {estateInfo.estate.neighborhood.name}
        </h5>
      </Col>
      {hasImageSection && (
        <Row className="mt-3">
          {images.map((imageAddress) => (
            <Col>
              <img
                src={imageAddress}
                alt={imageAddress}
                className="thumbnail rounded-3"
              />
            </Col>
          ))}
        </Row>
      )}
    </Row>
  );
};

export default EstateInfoModal;
