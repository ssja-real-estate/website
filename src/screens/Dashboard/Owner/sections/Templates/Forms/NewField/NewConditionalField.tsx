import { useState } from 'react';
import {
  Accordion,
  Button,
  CloseButton,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from 'react-bootstrap';
import { atom, useRecoilState } from 'recoil';
import {
  Field,
  FieldType,
  FieldTypeTitle,
} from '../../../../../../../global/types/Field';

export const innerFieldsAtom = atom<Field[]>({
  key: 'ownerInnerFieldsState',
  default: [],
});

function NewConditionalField() {
  const [innerFields, setInnerFields] = useRecoilState(innerFieldsAtom);
  const [newInnerFieldTitle, setNewInnerFieldTitle] = useState<string>('');
  const [selectedType, setSelectedType] = useState<number>(0);
  const [newOptionTitle, setNewOptionTitle] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);

  function addNewInnerField(newField: Field) {
    const newInnerFields = [newField, ...innerFields];
    setInnerFields(newInnerFields);
  }

  function moveItemUp(fieldIndex: number) {
    const tempInnerFields = Object.assign([], innerFields);
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempInnerFields.splice(fieldIndex, 1);
    tempInnerFields.splice(indexToMoveTo, 0, reorderedItem);
    setInnerFields(tempInnerFields);
  }

  function moveItemDown(fieldIndex: number) {
    const tempInnerFields = Object.assign([], innerFields);
    const indexToMoveTo =
      fieldIndex === tempInnerFields.length - 1
        ? tempInnerFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempInnerFields.splice(fieldIndex, 1);
    tempInnerFields.splice(indexToMoveTo, 0, reorderedItem);
    setInnerFields(tempInnerFields);
  }

  return (
    <Accordion className="mt-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <span className="ms-3">ورودی شرطی جدید</span>
        </Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            {innerFields.map((field, fieldIndex) => {
              return (
                <ListGroup.Item key={fieldIndex} variant="warning">
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <i
                        className="bi-chevron-up d-block"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          moveItemUp(fieldIndex);
                        }}
                      ></i>
                      <i
                        className="bi-chevron-down d-block"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          moveItemDown(fieldIndex);
                        }}
                      ></i>
                    </Col>
                    <Col>
                      <h6 className="d-inline">{field.title}</h6>
                    </Col>
                    <Col>
                      <h6 className="d-inline text-muted">
                        {field.type === FieldType.Text
                          ? 'متن'
                          : field.type === FieldType.Number
                          ? 'عدد'
                          : field.type === FieldType.Select
                          ? 'انتخابی'
                          : field.type === FieldType.Bool
                          ? 'کلید'
                          : field.type === FieldType.Conditional
                          ? 'شرطی'
                          : field.type === FieldType.Image
                          ? 'تصویر'
                          : '---'}
                      </h6>
                    </Col>
                    <CloseButton
                      className="m-3"
                      onClick={() => {
                        const fields = innerFields;
                        const filteredFields = fields.filter((_, index) => {
                          return fieldIndex !== index;
                        });
                        if (
                          window.confirm('آیا از حذف این ورودی مطمئن هستید؟')
                        ) {
                          setInnerFields(filteredFields);
                        }
                      }}
                    />
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          <InputGroup className="mt-3" style={{ direction: 'ltr' }}>
            <Button
              variant="dark"
              onClick={() => {
                let newInnerField: Field = {
                  name: '',
                  title: '',
                  type: 0,
                  value: '',
                };
                switch (selectedType) {
                  case FieldType.Text:
                    newInnerField = {
                      name: newInnerFieldTitle,
                      title: newInnerFieldTitle,
                      type: FieldType.Text,
                      value: '',
                    };
                    break;
                  case FieldType.Number:
                    newInnerField = {
                      name: newInnerFieldTitle,
                      title: newInnerFieldTitle,
                      type: FieldType.Number,
                      value: 0,
                    };
                    break;
                  case FieldType.Select:
                    newInnerField = {
                      name: newInnerFieldTitle,
                      title: newInnerFieldTitle,
                      type: FieldType.Select,
                      value: '',
                      options: options,
                    };
                    break;
                  case FieldType.Bool:
                    newInnerField = {
                      name: newInnerFieldTitle,
                      title: newInnerFieldTitle,
                      type: FieldType.Bool,
                      value: false,
                    };
                    break;
                  case FieldType.Conditional:
                    break;
                  default:
                    break;
                }
                if (newInnerFieldTitle.trim() !== '') {
                  if (selectedType === FieldType.Select) {
                    if (options.length > 1) {
                      addNewInnerField(newInnerField);
                      setNewInnerFieldTitle('');
                      setOptions([]);
                    } else {
                      alert(
                        'لطفاً حدأقل دو گزینه برای ورودی داخلی جدید اضافه کنید'
                      );
                    }
                  } else {
                    addNewInnerField(newInnerField);
                    setNewInnerFieldTitle('');
                    setOptions([]);
                  }
                } else {
                  setNewInnerFieldTitle('');
                  alert('لطفاً یک عنوان برای ورودی داخلی جدید انتخاب کنید');
                }
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Select
              style={{ minWidth: 100, maxWidth: '15vw' }}
              value={selectedType}
              onChange={(e) => {
                setSelectedType(Number(e.currentTarget.value));
              }}
            >
              <option value={FieldType.Text}>{FieldTypeTitle.Text}</option>
              <option value={FieldType.Number}>{FieldTypeTitle.Number}</option>
              <option value={FieldType.Select}>{FieldTypeTitle.Select}</option>
              <option value={FieldType.Bool}>{FieldTypeTitle.Bool}</option>
            </Form.Select>
            <Form.Control
              type="text"
              placeholder="عنوان ورودی داخلی جدید"
              maxLength={30}
              value={newInnerFieldTitle}
              onChange={(e) => {
                setNewInnerFieldTitle(e.target.value);
              }}
            />
          </InputGroup>
          {selectedType === FieldType.Select && (
            <div className="w-100 d-flex flex-row justify-content-center">
              <div className="d-flex flex-column justify-content-center gap-2 pt-3">
                <InputGroup style={{ direction: 'ltr' }}>
                  <Button
                    variant="dark"
                    onClick={() => {
                      if (newOptionTitle.trim() !== '') {
                        setOptions([...options, newOptionTitle]);
                        setNewOptionTitle('');
                      } else {
                        setNewOptionTitle('');
                        alert(
                          'لطفاً یک عنوان معتبر برای گزینه جدید انتخاب کنید'
                        );
                      }
                    }}
                  >
                    <i className="bi-plus-lg fs-6"></i>
                  </Button>
                  <Form.Control
                    type="text"
                    placeholder="گزینه جدید"
                    value={newOptionTitle}
                    onChange={(e) => {
                      setNewOptionTitle(e.target.value);
                    }}
                  />
                </InputGroup>
                <ListGroup>
                  {options.map((option, optionIndex) => {
                    return (
                      <ListGroup.Item
                        key={optionIndex}
                        className="d-flex flex-row justify-content-between align-items-center"
                      >
                        {option}
                        <CloseButton
                          onClick={() => {
                            const newOptions = options;
                            const filteredOptions = newOptions.filter(
                              (_, index) => {
                                return optionIndex !== index;
                              }
                            );
                            setOptions(filteredOptions);
                          }}
                        />
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            </div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default NewConditionalField;
