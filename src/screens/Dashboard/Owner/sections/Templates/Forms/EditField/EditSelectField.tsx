import Strings from "global/constants/strings";
import { useState } from "react";
import {
  InputGroup,
  Button,
  Form,
  ListGroup,
  CloseButton,
} from "react-bootstrap";
import { useRecoilState } from "recoil";
import { editSelectFieldModalDataAtom } from "../FormsState";

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
                setEditSelectFieldModalData({
                  ...editSelectFieldModalData,
                  data: {
                    ...editSelectFieldModalData.data,
                    options: newOptions,
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
            onChange={(e) => {
              setNewOptionTitle(e.target.value);
            }}
          />
        </InputGroup>
        <ListGroup>
          {editSelectFieldModalData.data.options!.map((option, optionIndex) => {
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
                    setEditSelectFieldModalData({
                      ...editSelectFieldModalData,
                      data: {
                        ...editSelectFieldModalData.data,
                        options: filteredOptions,
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
