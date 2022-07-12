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
  const [newItemTitle, setNewItemTitle] = useState<string>("");

  return (
    <div className="w-100 d-flex flex-row justify-content-center">
      <div className="d-flex flex-column justify-content-center gap-2 pt-3">
        <InputGroup style={{ direction: "ltr" }}>
          <Button
            variant="dark"
            onClick={() => {
              if (newItemTitle.trim() !== "") {
                const fieldType = editSelectFieldModalData.data.type;
                const field = editSelectFieldModalData.data;
                const items =
                  fieldType === FieldType.Select
                    ? field.options ?? []
                    : field.keys ?? [];
                const newItems = [...items, newItemTitle];
                setEditSelectFieldModalData({
                  ...editSelectFieldModalData,
                  data: {
                    ...editSelectFieldModalData.data,
                    options: fieldType === FieldType.Select ? newItems : [],
                    keys: fieldType === FieldType.MultiSelect ? newItems : [],
                  },
                });
              } else {
                alert(Strings.enterValidInputForNewOption);
              }
              setNewItemTitle("");
            }}
          >
            <i className="bi-plus-lg fs-6"></i>
          </Button>
          <Form.Control
            type="text"
            placeholder={Strings.newOption}
            value={newItemTitle}
            onChange={(e: { target: { value: SetStateAction<string> } }) => {
              setNewItemTitle(e.target.value);
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
                    console.log("edit select field modal data");
                    console.log(editSelectFieldModalData);

                    const fieldType = editSelectFieldModalData.data.type;
                    const field = editSelectFieldModalData.data;
                    const items =
                      (fieldType === FieldType.Select
                        ? field.options
                        : field.keys) ?? [];
                    // const newOptions = editSelectFieldModalData.data.options!;
                    const filteredItems = items.filter((_, index) => {
                      return optionIndex !== index;
                    });
                    setEditSelectFieldModalData({
                      ...editSelectFieldModalData,
                      data: {
                        ...editSelectFieldModalData.data,
                        options:
                          fieldType === FieldType.Select
                            ? filteredItems
                            : undefined,
                        keys:
                          fieldType === FieldType.MultiSelect
                            ? filteredItems
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
