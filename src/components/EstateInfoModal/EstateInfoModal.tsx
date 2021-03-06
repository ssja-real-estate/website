import Strings from "global/constants/strings";
import { imagesBaseUrl } from "global/states/GlobalState";
import { Field, FieldType } from "global/types/Field";
import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { v4 } from "uuid";
import "./EstateInfoModal.css";
import { estateInfoModalAtom } from "./EstateInfoModalState";

const EstateInfoModal = () => {
  const estateInfo = useRecoilValue(estateInfoModalAtom);
  const [hasImageSection, setHasImageSection] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [displayProperties, setDisplayProperties] = useState<string[]>([]);

  const mounted = useRef(true);

  useEffect(() => {
    if (mounted) {
      checkImageSection();
      let displayTexts: string[] = [];
      estateInfo.estate.dataForm.fields
        .filter((f) => f.type !== FieldType.Image)
        .forEach((field) => {
          const texts = displayFieldValues(field);
          displayTexts.push(...texts);
        });
      setDisplayProperties([...displayProperties, ...displayTexts]);
    }

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkImageSection = () => {
    const fields = estateInfo.estate.dataForm.fields;
    if (fields.length < 1) return;

    const lastField = fields[fields.length - 1];
    if (!lastField || lastField.type !== FieldType.Image) return;

    const includesImages = (lastField.value as string[]).length > 0;
    setHasImageSection(includesImages);

    if (includesImages) {
      const images: string[] = [];
      (lastField.value as string[]).forEach((image) => {
        images.push(`${imagesBaseUrl}/${estateInfo.estate.id}/${image}`);
      });
      setImages(images);
    }
  };

  function displayFieldValues(field: Field) {
    let displayText = `${field.title} : `;
    let value: any;
    let innerFieldValues: string[] = [];
    if (field.type === FieldType.Bool) {
      value = field.value as boolean;
      displayText += `${value ? "????????" : "??????????"}`;
    } else if (field.type === FieldType.BooleanConditional) {
      value = field.value as boolean;

      displayText += `${value ? "????????" : "??????????"}`;
      innerFieldValues = [];
      for (const innerField of field.fields ?? []) {
        innerFieldValues.push(...displayFieldValues(innerField));
      }
    } else if (field.type === FieldType.SelectiveConditional) {
      value = field.value as string;
      displayText += value;

      innerFieldValues = [];
      let innerFields =
        field.fieldMaps?.find((fm) => fm.key === value)?.fields ?? [];
      for (const innerField of innerFields) {
        innerFieldValues.push(...displayFieldValues(innerField));
      }
    } else if (field.type === FieldType.MultiSelect) {
      value = field.value as { [key: string]: boolean };
      innerFieldValues = [];
      for (const key of Object.keys(value)) {
        innerFieldValues.push(`${key} : ${value[key] ? "????????" : "??????????"}`);
      }
    } else {
      displayText += field.value;
    }

    return [displayText, ...innerFieldValues];
  }

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
        {hasImageSection && (
          <div className="row row-cols-5 m-5">
            {images.map((imageAddress) => (
              <Col>
                <img
                  src={imageAddress}
                  alt={imageAddress}
                  className="thumbnail rounded-3"
                  key={v4()}
                />
              </Col>
            ))}
          </div>
        )}
      </Col>
      <Col>
        <Row>
          {displayProperties.map((text) => (
            <h5 className="pt-3" key={v4()}>
              {text}
            </h5>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default EstateInfoModal;
