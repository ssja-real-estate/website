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
                const options = editSelectFieldModalData?.options!;
                const newOptions = [...options, newOptionTitle];
                setEditSelectFieldModalData({
                  ...editSelectFieldModalData!,
                  options: newOptions,
                });
                setNewOptionTitle("");
              } else {
                setNewOptionTitle("");
                alert(Strings.enterValidInputForNewOption);
              }
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
          {editSelectFieldModalData?.options?.map((option, optionIndex) => {
            return (
              <ListGroup.Item
                key={optionIndex}
                className="d-flex flex-row justify-content-between align-items-center"
              >
                {option}
                <CloseButton
                  onClick={() => {
                    const newOptions = editSelectFieldModalData.options!;
                    const filteredOptions = newOptions.filter((_, index) => {
                      return optionIndex !== index;
                    });
                    setEditSelectFieldModalData({
                      ...editSelectFieldModalData,
                      options: filteredOptions,
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
