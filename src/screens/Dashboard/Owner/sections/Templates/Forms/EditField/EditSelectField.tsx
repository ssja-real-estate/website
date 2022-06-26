import { SetStateAction, useState } from "react";
import {
  InputGroup,
  Button,
  Form,
  ListGroup,
  CloseButton,
} from "react-bootstrap";
import { useRecoilState } from "recoil";

import Strings from "global/constants/strings";
import { editSelectFieldModalDataAtom } from "../FormsState";
import { FieldType } from "global/types/Field";

function EditSelectField() {
  const [editSelectFieldModalData, setEditSelectFieldModalData] =
    useRecoilState(editSelectFieldModalDataAtom);
  const [newOptionTitle, setNewOptionTitle] = useState<string>("");

  return (
    <div className="w-100 d-flex flex-row justify-content-center">
      <div className="d-flex flex-column justify-content-center gap-2 pt-3">
        <InputGroup style={{ direction: "ltr" }}>
          <Button
            variant="dark"
            onClick={() => {
              if (newOptionTitle.trim() !== "") {
                const options = editSelectFieldModalData.data.options!;
                const newOptions = [...options, newOptionTitle];
                const fieldType = editSelectFieldModalData.data.type;
                setEditSelectFieldModalData({
                  ...editSelectFieldModalData,
                  data: {
                    ...editSelectFieldModalData.data,
                    options:
                      fieldType === FieldType.Select ? newOptions : undefined,
                    keys:
                      fieldType === FieldType.MultiSelect
                        ? newOptions
                        : undefined,
                  },
                });
              } else {
                alert(Strings.enterValidInputForNewOption);
              }
              setNewOptionTitle("");
            }}
          >
            <i className="bi-plus-lg fs-6"></i>
          </Button>
          <Form.Control
            type="text"
            placeholder={Strings.newOption}
            value={newOptionTitle}
            onChange={(e: { target: { value: SetStateAction<string> } }) => {
              setNewOptionTitle(e.target.value);
            }}
          />
        </InputGroup>
        <ListGroup>
          {(editSelectFieldModalData.data.type === FieldType.Select
            ? editSelectFieldModalData.data.options!
            : editSelectFieldModalData.data.keys!
          ).map((option, optionIndex) => {
            return (
              <ListGroup.Item
                key={optionIndex}
                className="d-flex flex-row justify-content-between align-items-center"
              >
                {option}
                <CloseButton
                  onClick={() => {
                    const newOptions = editSelectFieldModalData.data.options!;
                    const filteredOptions = newOptions.filter((_, index) => {
                      return optionIndex !== index;
                    });
                    const fieldType = editSelectFieldModalData.data.type;
                    setEditSelectFieldModalData({
                      ...editSelectFieldModalData,
                      data: {
                        ...editSelectFieldModalData.data,
                        options:
                          fieldType === FieldType.Select
                            ? filteredOptions
                            : undefined,
                        keys:
                          fieldType === FieldType.MultiSelect
                            ? filteredOptions
                            : undefined,
                      },
                    });
                  }}
                />
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    </div>
  );
}

export default EditSelectField;
