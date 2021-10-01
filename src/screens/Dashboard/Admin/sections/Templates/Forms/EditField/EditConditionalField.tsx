import { useState } from 'react';
import {
  Button,
  CloseButton,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import CustomModal from '../../../../../../../components/CustomModal/CustomModal';
import {
  Field,
  FieldType,
  FieldTypeTitle,
} from '../../../../../../../global/types/Field';
import { innerFieldModalDataAtom } from '../EditSection';

interface ModalField extends Field {
  id: number;
}

function EditConditionalField() {
  const [innerFieldModalData, setInnerFieldModalData] = useRecoilState(
    innerFieldModalDataAtom
  );
  const [showRenameInnerFieldModal, setShowRenameInnerFieldModal] =
    useState<boolean>(false);
  const [renameInnerFieldModalData, setRenameInnerFieldModalData] =
    useState<ModalField>();
  const [newInnerFieldTitle, setNewInnerFieldTitle] = useState<string>('');
  const [selectedType, setSelectedType] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [newOptionTitle, setNewOptionTitle] = useState<string>('');
  const [showEditSelectFieldModal, setShowEditSelectFieldModal] =
    useState<boolean>(false);
  const [editSelectFieldModalData, setEditSelectFieldModalData] =
    useState<ModalField>();

  function addNewInnerField(newField: Field) {
    const newInnerFields = [newField, ...innerFieldModalData.fields!];
    setInnerFieldModalData({
      ...innerFieldModalData,
      fields: newInnerFields,
    });
  }

  function updateChangedSelectField(
    field: ModalField,
    innerFieldIndex: number
  ) {
    const innerFields = Object.assign([], field.fields);
    const changedField: Field = {
      title: editSelectFieldModalData!.title,
      name: editSelectFieldModalData!.name,
      type: editSelectFieldModalData!.type,
      value: editSelectFieldModalData!.value,
      options: editSelectFieldModalData!.options,
    };
    innerFields.splice(innerFieldIndex, 1, changedField);

    setInnerFieldModalData({ ...innerFieldModalData, fields: innerFields });
  }

  function moveItemUp(fieldIndex: number) {
    const tempFields = [...innerFieldModalData!.fields!];
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setInnerFieldModalData({ ...innerFieldModalData!, fields: tempFields });
  }

  function moveItemDown(fieldIndex: number) {
    const tempFields = [...innerFieldModalData!.fields!];
    const indexToMoveTo =
      fieldIndex === tempFields.length - 1
        ? tempFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setInnerFieldModalData({ ...innerFieldModalData!, fields: tempFields });
  }

  return (
    <>
      <ListGroup>
        {innerFieldModalData.fields?.map((innerField, innerFieldIndex) => {
          return (
            <ListGroup.Item key={innerFieldIndex} variant="warning">
              <Row className="align-items-center">
                <Col xs="auto">
                  <i
                    className="bi-chevron-up d-block"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      moveItemUp(innerFieldIndex);
                    }}
                  ></i>
                  <i
                    className="bi-chevron-down d-block"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      moveItemDown(innerFieldIndex);
                    }}
                  ></i>
                </Col>
                <Col>
                  <h6 className="d-inline">{innerField.title}</h6>
                  <i
                    className="bi-pencil-fill me-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setRenameInnerFieldModalData({
                        ...innerField,
                        id: innerFieldIndex,
                      });
                      setShowRenameInnerFieldModal(true);
                    }}
                  ></i>
                </Col>
                <Col>
                  <h6 className="d-inline text-muted">
                    {innerField.type === FieldType.Text
                      ? 'متن'
                      : innerField.type === FieldType.Number
                      ? 'عدد'
                      : innerField.type === FieldType.Select
                      ? 'انتخابی'
                      : innerField.type === FieldType.Bool
                      ? 'کلید'
                      : innerField.type === FieldType.Conditional
                      ? 'شرطی'
                      : innerField.type === FieldType.Image
                      ? 'تصویر'
                      : '---'}
                  </h6>
                  {innerField.type === FieldType.Select && (
                    <i
                      className="bi-list fs-4 me-3"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setEditSelectFieldModalData({
                          ...innerField,
                          id: innerFieldIndex,
                        });
                        setShowEditSelectFieldModal(true);
                      }}
                    ></i>
                  )}
                </Col>
                <CloseButton
                  className="m-3"
                  onClick={() => {
                    const fields = innerFieldModalData.fields;
                    const filteredFields = fields!.filter((_, index) => {
                      return innerFieldIndex !== index;
                    });
                    if (window.confirm('آیا از حذف این ورودی مطمئن هستید؟')) {
                      setInnerFieldModalData({
                        ...innerFieldModalData,
                        fields: filteredFields,
                      });
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
                    alert('لطفاً یک عنوان معتبر برای گزینه جدید انتخاب کنید');
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

      <CustomModal
        show={showRenameInnerFieldModal}
        title="تغییر عنوان ورودی داخلی"
        cancelTitle="لغو"
        successTitle="ذخیره"
        handleClose={() => {
          setShowRenameInnerFieldModal(false);
        }}
        handleSuccess={() => {
          const changedInnerField: Field = {
            ...renameInnerFieldModalData!,
          };
          const innerFields = Object.assign([], innerFieldModalData.fields);
          innerFields.splice(
            renameInnerFieldModalData!.id,
            1,
            changedInnerField
          );

          setInnerFieldModalData({
            ...innerFieldModalData,
            fields: innerFields,
          });
          setShowRenameInnerFieldModal(false);
        }}
      >
        <Form.Control
          type="text"
          placeholder="عنوان جدید"
          value={renameInnerFieldModalData?.title}
          onChange={(e) => {
            setRenameInnerFieldModalData({
              ...renameInnerFieldModalData!,
              title: e.target.value,
            });
          }}
        />
      </CustomModal>
      <CustomModal
        show={showEditSelectFieldModal}
        title="ویرایش گزینه های ورودی انتخابی"
        cancelTitle="لغو"
        successTitle="ذخیره"
        handleClose={() => {
          setShowEditSelectFieldModal(false);
        }}
        handleSuccess={() => {
          if (editSelectFieldModalData!.options!.length > 1) {
            updateChangedSelectField(
              innerFieldModalData,
              editSelectFieldModalData!.id
            );
            setShowEditSelectFieldModal(false);
          } else {
            alert('لطفاً حداقل دو گزینه برای ورودی جدید انتخاب کنید');
          }
        }}
      >
        <div className="w-100 d-flex flex-row justify-content-center">
          <div className="d-flex flex-column justify-content-center gap-2 pt-3">
            <InputGroup style={{ direction: 'ltr' }}>
              <Button
                variant="dark"
                onClick={() => {
                  if (newOptionTitle.trim() !== '') {
                    const options = editSelectFieldModalData?.options!;
                    const newOptions = [...options, newOptionTitle];
                    setEditSelectFieldModalData({
                      ...editSelectFieldModalData!,
                      options: newOptions,
                    });
                    setNewOptionTitle('');
                  } else {
                    setNewOptionTitle('');
                    alert('لطفاً یک عنوان معتبر برای گزینه جدید انتخاب کنید');
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
                        const filteredOptions = newOptions.filter(
                          (_, index) => {
                            return optionIndex !== index;
                          }
                        );
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
      </CustomModal>
    </>
  );
}

export default EditConditionalField;
