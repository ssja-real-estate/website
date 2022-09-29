import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Strings from "../../../../../data/strings";
import {
  Field,
  FieldFilterableStatus,
  FieldFilterableStatusLabel,
  FieldInputNecessity,
  FieldInputNecessityLabel,
  FieldType,
} from "../../../../../global/types/Field";
import Section from "../../../../../global/types/Section";
import { getFieldTypeAndNecessity } from "../../../../../services/utilities/stringUtility";
import CustomModal from "../../../../modal/CustomModal";
import {
  defaultEditSelectFieldModalData,
  EditFieldModalData,
  editSelectFieldModalDataAtom,
  innerFieldModalDataAtom,
  modalSectionAtom,
  selectiveInnerFieldModalDataAtom,
} from "./FormsState";
import * as IoIcon from "react-icons/io";
import * as Io5Icon from "react-icons/io5";
import * as AiIcon from "react-icons/ai";
import * as MdIcon from "react-icons/md";
import NewField from "./NewField/NewField";
import InnerCustomModal from "../../../../modal/InnerCustomModal";
import EditConditionalField from "./EditField/EditConditionalField";
import EditSelectField from "./EditField/EditSelectField";
function EditSection() {
  const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);
  const [showRenameFieldModal, setShowRenameFieldModal] =
    useState<boolean>(false);
  const [renameFieldModalData, setRenameFieldModalData] =
    useState<EditFieldModalData>({
      index: -1,
      newTitle: "",
      newType: 0,
      newFieldInputNecessity: FieldInputNecessity.Obligatory,
      filterable: false,
    });
  const [showEditInnerFieldsModal, setShowEditInnerFieldsModal] =
    useState<boolean>(false);
  const [
    showEditSelectiveInnerFieldModal,
    setShowEditSelectiveInnerFieldModal,
  ] = useState(false);
  const [innerFieldModalData, setInnerFieldModalData] = useRecoilState(
    innerFieldModalDataAtom
  );
  const [selectiveInnerField, setSelectiveInnerFieldData] = useRecoilState(
    selectiveInnerFieldModalDataAtom
  );
  const [showEditSelectFieldModal, setShowEditSelectFieldModal] =
    useState<boolean>(false);
  const [editSelectFieldModalData, setEditSelectFieldModalData] =
    useRecoilState(editSelectFieldModalDataAtom);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, [modalSection, modalSection.data.title]);

  function moveItemUp(fieldIndex: number) {
    const tempFields = [...modalSection.data.fields];
    const indexToMoveTo = fieldIndex === 0 ? 0 : fieldIndex - 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setModalSection({
      ...modalSection,
      data: { ...modalSection.data, fields: tempFields },
    });
  }

  function moveItemDown(fieldIndex: number) {
    const tempFields = [...modalSection.data.fields];
    const indexToMoveTo =
      fieldIndex === tempFields.length - 1
        ? tempFields.length - 1
        : fieldIndex + 1;
    const [reorderedItem] = tempFields.splice(fieldIndex, 1);
    tempFields.splice(indexToMoveTo, 0, reorderedItem);
    setModalSection({
      ...modalSection!,
      data: { ...modalSection.data, fields: tempFields },
    });
  }

  function updateChangedConditionalField() {
    const fields: Field[] = modalSection.data.fields.slice();
    const fieldIndex = innerFieldModalData.index;
    const data = innerFieldModalData.data;

    const changedField: Field = {
      id: data.id,
      title: data.title,
      type: data.type,
      value: data.value,
      fields: data.fields!,
    };
    fields.splice(fieldIndex, 1, changedField);

    setModalSection({
      ...modalSection,
      data: { ...modalSection.data, fields: fields },
    });
  }

  function updateChangedSelectiveConditionalField() {
    const fields: Field[] = modalSection.data.fields.slice();
    const fieldIndex = selectiveInnerField.index;
    const data = selectiveInnerField.data;

    const changedField: Field = {
      id: data.id,
      title: data.title,
      type: data.type,
      value: data.value,
      fields: data.fields!,
      fieldMaps: data.fieldMaps!,
      options: data.options!,
    };
    fields.splice(fieldIndex, 1, changedField);

    setModalSection({
      ...modalSection,
      data: { ...modalSection.data, fields: fields },
    });
  }

  function updateChangedSelectField() {
    const section: Section = { ...modalSection.data };
    const fields: Field[] = section.fields.slice();
    const fieldIndex = editSelectFieldModalData.index;
    const data = editSelectFieldModalData.data;

    const changedField: Field = {
      id: data.id,
      title: data.title,
      type: data.type,
      value: data.value,
      options: data.options,
      keys: data.keys,
    };
    fields.splice(fieldIndex, 1, changedField);

    setModalSection({
      ...modalSection,
      data: { ...modalSection.data, fields: fields },
    });
  }

  return (
    <>
      <ul className="flex flex-col  gap-2 text-dark-blue">
        {modalSection.data.fields.map((field, fieldIndex) => {
          return (
            <li
              key={fieldIndex}
              className="w-full rounded-2xl shadow-md py-2 px-2 transition-all duration-150 bg-[#f6f6f6] hover:bg-[#f6f6f6]/10"
            >
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2 w-52">
                  <div>
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
                  <div className="flex flex-row gap-1 text-sm">
                    <h6 className="font-bold text-right">{field.title}</h6>
                    {field.type !== FieldType.Image ? (
                      <AiIcon.AiFillEdit
                        className="text-xl cursor-pointer"
                        onClick={() => {
                          setRenameFieldModalData({
                            index: fieldIndex,
                            newTitle: field.title,
                            newType: field.type,
                            newFieldInputNecessity: field.optional
                              ? FieldInputNecessity.Optional
                              : FieldInputNecessity.Obligatory,
                            filterable: field.filterable,
                          });
                          setShowRenameFieldModal(true);
                        }}
                      />
                    ) : // <i
                    //   className="bi-pencil-fill me-2"
                    //   style={{ cursor: "pointer" }}

                    // >

                    // </i>
                    null}
                  </div>
                </div>
                <div className="flex flex-row text-sm gap-1 w-[45%]">
                  <h6 className="font-bold">
                    {getFieldTypeAndNecessity(field)}
                  </h6>
                  {field.type === FieldType.BooleanConditional && (
                    <MdIcon.MdOutlineEditNote
                      className="text-2xl font-bold cursor-pointer"
                      onClick={() => {
                        setInnerFieldModalData({
                          index: fieldIndex,
                          data: { ...field },
                        });
                        setShowEditInnerFieldsModal(true);
                      }}
                    />
                  )}
                  {(field.type === FieldType.Select ||
                    field.type === FieldType.MultiSelect) && (
                    <MdIcon.MdOutlineEditNote
                      className="text-2xl font-bold cursor-pointer"
                      onClick={() => {
                        setEditSelectFieldModalData({
                          index: fieldIndex,
                          data: {
                            ...field,
                            options: field.options ?? [],
                            keys: field.keys ?? [],
                          },
                        });
                        setShowEditSelectFieldModal(true);
                      }}
                    />
                    // <i
                    //   className="bi-list fs-4 me-3"
                    //   style={{ cursor: "pointer" }}
                    //   onClick={() => {
                    //     setEditSelectFieldModalData({
                    //       index: fieldIndex,
                    //       data: {
                    //         ...field,
                    //         options: field.options ?? [],
                    //         keys: field.keys ?? [],
                    //       },
                    //     });
                    //     setShowEditSelectFieldModal(true);
                    //   }}
                    // >
                    //   kkkkkk
                    // </i>
                  )}
                  {field.type === FieldType.SelectiveConditional && (
                    <MdIcon.MdOutlineEditNote
                      className="text-2xl font-bold cursor-pointer"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectiveInnerFieldData({
                          index: fieldIndex,
                          data: { ...field },
                        });
                        setEditSelectFieldModalData({
                          index: fieldIndex,
                          data: {
                            ...field,
                            type: FieldType.Select,
                            options: field.options,
                          },
                        });
                        setShowEditSelectiveInnerFieldModal(true);
                      }}
                    />
                  )}
                </div>
                {field.type !== FieldType.Image ? (
                  <button
                    className="m-3"
                    onClick={() => {
                      const fields = modalSection.data.fields;
                      const filteredFields = fields.filter((_, index) => {
                        return fieldIndex !== index;
                      });
                      if (window.confirm(Strings.confirmDeleteInput)) {
                        setModalSection({
                          ...modalSection,
                          data: {
                            ...modalSection.data,
                            fields: filteredFields,
                          },
                        });
                      }
                    }}
                  >
                    <Io5Icon.IoCloseSharp />
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      <InnerCustomModal
        show={showRenameFieldModal}
        isLarge
        title={Strings.changeInputTitle}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowRenameFieldModal(false);
        }}
        handleSuccess={() => {
          let fields = modalSection.data.fields.slice();
          let index = renameFieldModalData.index;

          if (index !== -1) {
            fields[index] = {
              ...fields[index],
              title: renameFieldModalData.newTitle,
              type: renameFieldModalData.newType,
              optional:
                renameFieldModalData.newFieldInputNecessity ===
                FieldInputNecessity.Optional,
              filterable: renameFieldModalData.filterable,
            };
          }

          setModalSection({
            ...modalSection,
            data: { ...modalSection.data, fields: fields },
          });
          setShowRenameFieldModal(false);
          setRenameFieldModalData({ index: -1, newTitle: "", newType: 0 });
        }}
      >
        <div className="px-2 flex flex-row my-3">
          <input
            className="inputDecoration"
            type="text"
            placeholder={Strings.newTitle}
            value={renameFieldModalData.newTitle}
            onChange={(e: { target: { value: any } }) => {
              setRenameFieldModalData({
                ...renameFieldModalData!,
                newTitle: e.target.value,
              });
            }}
          />
          <select
            className="selectbox"
            value={
              renameFieldModalData.filterable
                ? FieldFilterableStatus.IsFilterable
                : FieldFilterableStatus.IsNotFilterable
            }
            onChange={(e: { currentTarget: { value: string | number } }) => {
              const value = +e.currentTarget.value;
              setRenameFieldModalData({
                ...renameFieldModalData!,
                filterable: value === FieldFilterableStatus.IsFilterable,
              });
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
            // style={{ minWidth: 50, maxWidth: "10vw" }}
            className="selectbox"
            value={renameFieldModalData.newFieldInputNecessity}
            onChange={(e: { currentTarget: { value: any } }) => {
              setRenameFieldModalData({
                ...renameFieldModalData!,
                newFieldInputNecessity: Number(e.currentTarget.value),
              });
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
      </InnerCustomModal>
      <InnerCustomModal
        isFullscreen
        show={showEditInnerFieldsModal}
        title={Strings.editInnerInputs}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowEditInnerFieldsModal(false);
        }}
        handleSuccess={() => {
          updateChangedConditionalField();
          setShowEditInnerFieldsModal(false);
        }}
      >
        <div className="border-t border-b w-full h-[80vh] my-2 py-2 px-2 overflow-y-auto">
          <EditConditionalField />
        </div>
        {/* <div className="">EditConditionalField</div> */}
      </InnerCustomModal>
      <InnerCustomModal
        show={showEditSelectFieldModal}
        title={Strings.editOptions}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setShowEditSelectFieldModal(false);
          setEditSelectFieldModalData(defaultEditSelectFieldModalData);
        }}
        handleSuccess={() => {
          const selectField = editSelectFieldModalData.data;
          let validToUpdate =
            (selectField.type === FieldType.Select &&
              selectField.options!.length > 1) ||
            (selectField.type === FieldType.MultiSelect &&
              selectField.keys!.length > 1);

          if (validToUpdate) {
            updateChangedSelectField();
            setShowEditSelectFieldModal(false);
          } else {
            alert(Strings.chooseAtLeastTwoOptionsForSelect);
          }
        }}
      >
        <div className="border-t border-b w-full h-[80vh] my-2 py-2 px-2 overflow-y-auto">
          <EditSelectField />
        </div>
      </InnerCustomModal>
      <InnerCustomModal
        isFullscreen
        show={showEditSelectiveInnerFieldModal}
        title={Strings.editInnerInputs}
        cancelTitle={Strings.cancel}
        successTitle={Strings.save}
        handleClose={() => {
          setSelectiveInnerFieldData(defaultEditSelectFieldModalData);
          setEditSelectFieldModalData(defaultEditSelectFieldModalData);
          setShowEditSelectiveInnerFieldModal(false);
        }}
        handleSuccess={() => {
          updateChangedSelectiveConditionalField();
          setShowEditSelectiveInnerFieldModal(false);
        }}
      >
        {/* <EditSelectiveConditionalField /> */}
        <div className="border-t border-b w-full h-[80vh] my-2 py-2 px-2 overflow-y-auto">
          <div className="">EditSelectiveConditionalField</div>
        </div>
      </InnerCustomModal>
      <div className="flex flex-col items-stretch justify-center my-3">
        <h5 className="font-bold">{Strings.inputs}</h5>
        <NewField />
        <div className=""></div>
      </div>
    </>
  );
}

export default EditSection;
