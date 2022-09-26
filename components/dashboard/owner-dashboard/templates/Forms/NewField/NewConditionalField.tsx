import { SetStateAction, useState } from "react";
import { useRecoilState } from "recoil";
import Strings from "../../../../../../data/strings";
import {
  defaultField,
  Field,
  FieldFilterableStatus,
  FieldFilterableStatusLabel,
  FieldInputNecessity,
  FieldInputNecessityLabel,
  FieldType,
  FieldTypeTitle,
} from "../../../../../../global/types/Field";
import { getFieldTypeAndNecessity } from "../../../../../../services/utilities/stringUtility";
import Accordion from "./Accordion";
import { innerFieldsAtom } from "./NewFieldStates";
import * as BiIcon from "react-icons/bi";
import * as IoIcon from "react-icons/io";
import * as Io5Icon from "react-icons/io5";
import * as AiIcon from "react-icons/ai";
import * as MdIcon from "react-icons/md";
function NewConditionalField() {
  const [innerFields, setInnerFields] = useRecoilState(innerFieldsAtom);
  const [newInnerFieldTitle, setNewInnerFieldTitle] = useState<string>("");
  const [selectedType, setSelectedType] = useState<number>(0);
  const [newOptionTitle, setNewOptionTitle] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [fieldInputNecessity, setFieldInputNecessity] = useState<number>(
    FieldInputNecessity.Obligatory
  );
  const [filterableStatus, setFilterableStatus] = useState(
    FieldFilterableStatus.IsNotFilterable
  );

  function addNewInnerField(newField: Field) {
    if (newField.type === FieldType.Bool) {
      newField.value = false;
    } else if (newField.type === FieldType.Number) {
      newField.value = 0;
    }
    const newInnerFields = [...innerFields, newField];
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
    <div className="">
      <Accordion title={Strings.newConditionalField}>
        <div>
          <ul className="flex flex-col  gap-1 text-dark-blue w-full mb-2">
            {innerFields.map((field, fieldIndex) => {
              return (
                <li
                  className="bg-[#fff3cd] rounded-2xl px-2 py-2"
                  key={fieldIndex}
                >
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-4 items-center">
                      <div className="">
                        <IoIcon.IoIosArrowDown
                          onClick={() => {
                            moveItemUp(fieldIndex);
                          }}
                          className="rotate-180 cursor-pointer"
                        />
                        <IoIcon.IoIosArrowDown
                          onClick={() => {
                            moveItemDown(fieldIndex);
                          }}
                          className="cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-row gap-1">
                        <div>
                          <h6 className="d-inline">{field.title}</h6>
                        </div>
                        <div>
                          <h6 className="d-inline text-muted">
                            {getFieldTypeAndNecessity(field)}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <button
                      className="m-3"
                      onClick={() => {
                        const fields = innerFields;
                        const filteredFields = fields.filter((_, index) => {
                          return fieldIndex !== index;
                        });
                        if (window.confirm(Strings.confirmDeleteInput)) {
                          setInnerFields(filteredFields);
                        }
                      }}
                    >
                      <Io5Icon.IoCloseSharp />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <input
                type="text"
                className="inputDecoration w-[35vw]"
                placeholder={Strings.newInnerInputTitle}
                maxLength={30}
                value={newInnerFieldTitle}
                onChange={(e: {
                  target: { value: SetStateAction<string> };
                }) => {
                  setNewInnerFieldTitle(e.target.value);
                }}
              />
              <select
                className="defaultSelectbox w-[15vw]"
                value={selectedType}
                onChange={(e: { currentTarget: { value: any } }) => {
                  setSelectedType(Number(e.currentTarget.value));
                }}
              >
                <option value={FieldType.Text}>{FieldTypeTitle.Text}</option>
                <option value={FieldType.Number}>
                  {FieldTypeTitle.Number}
                </option>
                <option value={FieldType.Select}>
                  {FieldTypeTitle.Select}
                </option>
                <option value={FieldType.Bool}>{FieldTypeTitle.Bool}</option>
              </select>
              <select
                className="defaultSelectbox w-[15vw]"
                // style={{ minWidth: 100, maxWidth: "15vw" }}
                value={filterableStatus}
                onChange={(e: {
                  currentTarget: { value: string | number };
                }) => {
                  setFilterableStatus(+e.currentTarget.value);
                }}
              >
                <option value={FieldFilterableStatus.IsNotFilterable}>
                  {FieldFilterableStatusLabel.IsNotFilterable}
                </option>
                <option value={FieldFilterableStatus.IsFilterable}>
                  {FieldFilterableStatusLabel.IsFilterable}
                </option>
              </select>
              <select
                className="defaultSelectbox w-[15vw]"
                // style={{ minWidth: 100, maxWidth: "15vw" }}
                value={fieldInputNecessity}
                onChange={(e: { currentTarget: { value: any } }) => {
                  setFieldInputNecessity(Number(e.currentTarget.value));
                }}
              >
                <option value={FieldInputNecessity.Obligatory}>
                  {FieldInputNecessityLabel.Obligatory}
                </option>
                <option value={FieldInputNecessity.Optional}>
                  {FieldInputNecessityLabel.Optional}
                </option>
              </select>
            </div>
            <button
              className="border border-[#0ba] p-2 text-[#0ba] hover:text-white hover:bg-[#0ba]"
              onClick={() => {
                let newInnerField: Field = {
                  ...defaultField,
                  title: newInnerFieldTitle,
                  type: selectedType,
                  optional:
                    fieldInputNecessity === FieldInputNecessity.Optional,
                  filterable:
                    filterableStatus === FieldFilterableStatus.IsFilterable,
                };
                if (newInnerFieldTitle.trim() !== "") {
                  if (selectedType === FieldType.Select) {
                    if (options.length < 2) {
                      alert(Strings.chooseAtLeastTwoOptionsForSelect);
                      return;
                    }
                  }
                  newInnerField.options = options;
                  addNewInnerField(newInnerField);
                  setOptions([]);
                } else {
                  alert(Strings.enterValidTitleForInput);
                }
                setNewInnerFieldTitle("");
                setFieldInputNecessity(FieldInputNecessity.Obligatory);
                setFilterableStatus(FieldFilterableStatus.IsNotFilterable);
              }}
            >
              <BiIcon.BiPlus className="" />
            </button>
          </div>
          {selectedType === FieldType.Select && (
            <div className="w-full flex flex-row justify-center mt-2">
              <div className="d-flex flex-column justify-content-center gap-2 pt-3">
                <div className="flex flex-row">
                  <input
                    className="inputDecoration"
                    type="text"
                    placeholder={Strings.newOption}
                    value={newOptionTitle}
                    onChange={(e: {
                      target: { value: SetStateAction<string> };
                    }) => {
                      setNewOptionTitle(e.target.value);
                    }}
                  />
                  <button
                    className="border border-[#0ba] p-2 text-[#0ba] hover:text-white hover:bg-[#0ba]"
                    onClick={() => {
                      if (newOptionTitle.trim() !== "") {
                        setOptions([...options, newOptionTitle]);
                        setNewOptionTitle("");
                      } else {
                        setNewOptionTitle("");
                        alert(Strings.enterValidInputForNewOption);
                      }
                    }}
                  >
                    <BiIcon.BiPlus className="" />
                  </button>
                </div>
                <ul className="flex flex-col gap-2 mt-2">
                  {options.map((option, optionIndex) => {
                    return (
                      <li
                        key={optionIndex}
                        className="flex flex-row justify-between items-center border p-2 rounded-xl"
                      >
                        {option}
                        <button
                          onClick={() => {
                            const newOptions = options;
                            const filteredOptions = newOptions.filter(
                              (_, index) => {
                                return optionIndex !== index;
                              }
                            );
                            setOptions(filteredOptions);
                          }}
                        >
                          <Io5Icon.IoCloseSharp />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Accordion>
    </div>
    // <Accordion className="mt-3">
    //   <Accordion.Item eventKey="0">
    //     <Accordion.Header>
    //       <span className="ms-3">{Strings.newConditionalField}</span>
    //     </Accordion.Header>
    //     <Accordion.Body>
    //       <ListGroup>
    //         {innerFields.map((field, fieldIndex) => {
    //           return (
    //             <ListGroup.Item key={fieldIndex} variant="warning">
    //               <Row className="align-items-center">
    //                 <Col xs="auto">
    //                   <i
    //                     className="bi-chevron-up d-block"
    //                     style={{ cursor: "pointer" }}
    //                     onClick={() => {
    //                       moveItemUp(fieldIndex);
    //                     }}
    //                   ></i>
    //                   <i
    //                     className="bi-chevron-down d-block"
    //                     style={{ cursor: "pointer" }}
    //                     onClick={() => {
    //                       moveItemDown(fieldIndex);
    //                     }}
    //                   ></i>
    //                 </Col>
    //                 <Col>
    //                   <h6 className="d-inline">{field.title}</h6>
    //                 </Col>
    //                 <Col>
    //                   <h6 className="d-inline text-muted">
    //                     {getFieldTypeAndNecessity(field)}
    //                   </h6>
    //                 </Col>
    //                 <CloseButton
    //                   className="m-3"
    //                   onClick={() => {
    //                     const fields = innerFields;
    //                     const filteredFields = fields.filter((_, index) => {
    //                       return fieldIndex !== index;
    //                     });
    //                     if (window.confirm(Strings.confirmDeleteInput)) {
    //                       setInnerFields(filteredFields);
    //                     }
    //                   }}
    //                 />
    //               </Row>
    //             </ListGroup.Item>
    //           );
    //         })}
    //       </ListGroup>
    //       <InputGroup className="mt-3" style={{ direction: "ltr" }}>
    //         <Button
    //           variant="dark"
    //           onClick={() => {
    //             let newInnerField: Field = {
    //               ...defaultField,
    //               title: newInnerFieldTitle,
    //               type: selectedType,
    //               optional:
    //                 fieldInputNecessity === FieldInputNecessity.Optional,
    //               filterable:
    //                 filterableStatus === FieldFilterableStatus.IsFilterable,
    //             };
    //             if (newInnerFieldTitle.trim() !== "") {
    //               if (selectedType === FieldType.Select) {
    //                 if (options.length < 2) {
    //                   alert(Strings.chooseAtLeastTwoOptionsForSelect);
    //                   return;
    //                 }
    //               }
    //               newInnerField.options = options;
    //               addNewInnerField(newInnerField);
    //               setOptions([]);
    //             } else {
    //               alert(Strings.enterValidTitleForInput);
    //             }
    //             setNewInnerFieldTitle("");
    //             setFieldInputNecessity(FieldInputNecessity.Obligatory);
    //             setFilterableStatus(FieldFilterableStatus.IsNotFilterable);
    //           }}
    //         >
    //           <i className="bi-plus-lg fs-6"></i>
    //         </Button>
    //         <Form.Select
    //           style={{ minWidth: 100, maxWidth: "15vw" }}
    //           value={fieldInputNecessity}
    //           onChange={(e: { currentTarget: { value: any } }) => {
    //             setFieldInputNecessity(Number(e.currentTarget.value));
    //           }}
    //         >
    //           <option value={FieldInputNecessity.Obligatory}>
    //             {FieldInputNecessityLabel.Obligatory}
    //           </option>
    //           <option value={FieldInputNecessity.Optional}>
    //             {FieldInputNecessityLabel.Optional}
    //           </option>
    //         </Form.Select>
    //         <Form.Select
    //           style={{ minWidth: 100, maxWidth: "15vw" }}
    //           value={filterableStatus}
    //           onChange={(e: { currentTarget: { value: string | number } }) => {
    //             setFilterableStatus(+e.currentTarget.value);
    //           }}
    //         >
    //           <option value={FieldFilterableStatus.IsNotFilterable}>
    //             {FieldFilterableStatusLabel.IsNotFilterable}
    //           </option>
    //           <option value={FieldFilterableStatus.IsFilterable}>
    //             {FieldFilterableStatusLabel.IsFilterable}
    //           </option>
    //         </Form.Select>
    //         <Form.Select
    //           style={{ minWidth: 100, maxWidth: "15vw" }}
    //           value={selectedType}
    //           onChange={(e: { currentTarget: { value: any } }) => {
    //             setSelectedType(Number(e.currentTarget.value));
    //           }}
    //         >
    //           <option value={FieldType.Text}>{FieldTypeTitle.Text}</option>
    //           <option value={FieldType.Number}>{FieldTypeTitle.Number}</option>
    //           <option value={FieldType.Select}>{FieldTypeTitle.Select}</option>
    //           <option value={FieldType.Bool}>{FieldTypeTitle.Bool}</option>
    //         </Form.Select>
    //         <Form.Control
    //           type="text"
    //           placeholder={Strings.newInnerInputTitle}
    //           maxLength={30}
    //           value={newInnerFieldTitle}
    //           onChange={(e: { target: { value: SetStateAction<string> } }) => {
    //             setNewInnerFieldTitle(e.target.value);
    //           }}
    //         />
    //       </InputGroup>
    //       {selectedType === FieldType.Select && (
    //         <div className="w-100 d-flex flex-row justify-content-center">
    //           <div className="d-flex flex-column justify-content-center gap-2 pt-3">
    //             <InputGroup style={{ direction: "ltr" }}>
    //               <Button
    //                 variant="dark"
    //                 onClick={() => {
    //                   if (newOptionTitle.trim() !== "") {
    //                     setOptions([...options, newOptionTitle]);
    //                     setNewOptionTitle("");
    //                   } else {
    //                     setNewOptionTitle("");
    //                     alert(Strings.enterValidInputForNewOption);
    //                   }
    //                 }}
    //               >
    //                 <i className="bi-plus-lg fs-6"></i>
    //               </Button>
    //               <Form.Control
    //                 type="text"
    //                 placeholder={Strings.newOption}
    //                 value={newOptionTitle}
    //                 onChange={(e: {
    //                   target: { value: SetStateAction<string> };
    //                 }) => {
    //                   setNewOptionTitle(e.target.value);
    //                 }}
    //               />
    //             </InputGroup>
    //             <ListGroup>
    //               {options.map((option, optionIndex) => {
    //                 return (
    //                   <ListGroup.Item
    //                     key={optionIndex}
    //                     className="d-flex flex-row justify-content-between align-items-center"
    //                   >
    //                     {option}
    //                     <CloseButton
    //                       onClick={() => {
    //                         const newOptions = options;
    //                         const filteredOptions = newOptions.filter(
    //                           (_, index) => {
    //                             return optionIndex !== index;
    //                           }
    //                         );
    //                         setOptions(filteredOptions);
    //                       }}
    //                     />
    //                   </ListGroup.Item>
    //                 );
    //               })}
    //             </ListGroup>
    //           </div>
    //         </div>
    //       )}
    //     </Accordion.Body>
    //   </Accordion.Item>
    // </Accordion>
  );
}

export default NewConditionalField;
