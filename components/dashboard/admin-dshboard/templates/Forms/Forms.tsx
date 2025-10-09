import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Strings from "../../../../../data/strings";
import { globalState } from "../../../../../global/states/globalStates";
import DelegationType from "../../../../../global/types/DelegationType";
import { v4 } from "uuid";
import {
  defaultForm,
  EstateForm,
} from "../../../../../global/types/EstateForm";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import EstateType from "../../../../../global/types/EstateType";
import {
  defaultField,
  Field,
  FieldType,
} from "../../../../../global/types/Field";
import DelegationTypeService from "../../../../../services/api/DelegationTypeService/DelegationTypeService";
import EstateTypeService from "../../../../../services/api/EstateTypeService/EstateTypeService";
import FormService from "../../../../../services/api/FormService/FormService";
import { defaultModalSection, modalSectionAtom } from "./FormsState";
import CustomModal from "../../../../modal/CustomModal";
import EditSection from "./EditSection";
import Spiner from "../../../../spinner/Spiner";
import { getFieldTypeAndNecessity } from "../../../../../services/utilities/stringUtility";
import * as HiIcon from "react-icons/hi";
import GlobalState from "../../../../../global/states/GlobalState";
const Forms = () => {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [estateTypes, setEstateTypes] = useState<EstateType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [delegationType, setDelegationType] = useState<DelegationType>({
    id: "",
    name: "default",
  });

  const [estateType, setEstateType] = useState<EstateType>({
    id: "",
    name: "default",
    order:1,
  });

  const isDefault =
    delegationType.name === "default" || estateType.name === "default"
      ? true
      : false;

  const [form, setForm] = useState<EstateForm>(defaultForm);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const [showEditSectionModal, setShowEditSectionModal] =
    useState<boolean>(false);
  const [modalSection, setModalSection] = useRecoilState(modalSectionAtom);

  const state = useRecoilValue<GlobalState>(globalState);
  const formService = useRef(new FormService());
  const delegationTypeService = useRef(new DelegationTypeService());
  const estateTypeService = useRef(new EstateTypeService());
  const mounted = useRef(true);

  useEffect(() => {
    formService.current.setToken(state.token);
    delegationTypeService.current.setToken(state.token);
    estateTypeService.current.setToken(state.token);
    loadOptions();
    loadData();
    console.log(form);
    return () => {
      mounted.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    !isDefault && loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDefault, delegationType.name, estateType.name]);

  const loadOptions = async () => {
    delegationTypeService.current
      .getAllDelegationTypes()
      .then((delegationTypes) => {
        setDelegationTypes(delegationTypes);
      })
      .then(() => estateTypeService.current.getAllEstateTypes())
      .then((estateTypes) => {
        setEstateTypes(estateTypes);
      })
      .catch((_) => {
        // toast.error(Strings.loadingLocationsFailed);
        alert(Strings.loadingLocationsFailed);
      });
  };

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }

    if (!delegationType.id || !estateType.id) {
      return;
    }
    const loadedForm = await formService.current.getForm(
      delegationType.id,
      estateType.id
    );

    if (!loadedForm) {
      setLoading((prev) => false);
      setForm(defaultForm);
      setHasImage(false);
      return;
    }

    if (includesImageSection(loadedForm)) {
      setHasImage(true);
    } else {
      setHasImage(false);
    }
    setForm(loadedForm);
    await loadOptions();
    setLoading((prev) => false);
  };

  const handleFieldDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const tempFields = [...form!.fields];
    const [reorderedField] = tempFields.splice(result.source.index, 1);
    tempFields.splice(result.destination!.index, 0, reorderedField);

    setForm({ ...form!, fields: tempFields });
  };

  const handleImagesSection = () => {
    if (!form) return;

    let newFields = form.fields.slice();
    const hasImageSection = includesImageSection(form);
    if (hasImageSection) {
      const length = newFields.length;
      newFields = newFields.slice(0, length - 1);
    } else {
      const newField: Field = {
        ...defaultField,
        type: FieldType.Image,
        title: Strings.chooseImages,
        value: [],
        optional: true,
      };
      newFields.push(newField);
    }

    setForm({ ...form, fields: newFields });
  };

  const includesImageSection = (estateForm: EstateForm) => {
    if (!estateForm.fields.length) return false;

    const imageField = estateForm.fields.find((field) => {
      return field.type === FieldType.Image;
    });

    return imageField !== undefined;
  };

  const updateChangedSection = () => {
    const fields = [...modalSection.data.fields];
    if (hasImage) {
      const imageField = { ...fields[0] };
      fields.shift();
      fields.push(imageField);
    }
    setForm({ ...form, fields });
    setModalSection(defaultModalSection);
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    if (form) {
      const formDelegationType = delegationTypes.find(
        (d) => d.id === delegationType.id
      );
      const formEstateType = estateTypes.find((e) => e.id === estateType.id);
      if (!formDelegationType || !formEstateType) {
        // toast.error(Strings.chooseDelegationAndEstateTypes);
        alert(Strings.chooseDelegationAndEstateTypes);
        return;
      }
      const targetForm: EstateForm = {
        ...form,
        title: `${formDelegationType!.name} ${formEstateType!.name}`,
        assignmentTypeId: delegationType.id,
        estateTypeId: estateType.id,
      };
      console.log(targetForm);

      if (targetForm.id) {
        await formService.current.updateForm(targetForm.id, targetForm);
      } else {
        if (targetForm.fields.length > 0) {
          await formService.current.createForm(targetForm);
        }
      }
    }
    await loadData();
  };

  return (
    <>
      <div className="flex flex-row items-center gap-2 justify-center">
        <h4 className="text-2xl text-dark-blue font-bold">{Strings.forms}</h4>
        <button
          className="w-7 h-7 shadow-xl rounded-full flex items-center justify-center hover:bg-[#0ba] group"
          onClick={async () => {
            if (isDefault) {
              await loadOptions();
              return;
            }
            await loadData();
          }}
        >
          <HiIcon.HiOutlineRefresh className="text-md group-hover:text-white" />
        </button>
      </div>

      <CustomModal
        isFullscreen={true}
        show={showEditSectionModal}
        title={Strings.editForm}
        cancelTitle={Strings.cancel}
        successTitle={Strings.saveChanges}
        handleClose={() => {
          setShowEditSectionModal(false);
          setModalSection({
            index: 0,
            data: { fields: form.fields },
          });
        }}
        handleSuccess={() => {
          updateChangedSection();
          setShowEditSectionModal(false);
        }}
      >
        <div className="border-t border-b my-2 h-[80vh] overflow-y-auto px-10 py-5">
          <EditSection />
        </div>

        {/* <div className=""></div> */}
      </CustomModal>
      <div className="flex flex-row mt-5 items-center justify-between">
        <div className="w-full flex-1">
          <select
            className="selectbox w-[49%]"
            value={delegationType.name}
            onChange={(e: { currentTarget: { value: any } }) => {
              setDelegationType({
                id: e.currentTarget.value,
                name: e.currentTarget.value,
              });
            }}
          >
            <option value="default" disabled>
              {Strings.chooseDelegationType}
            </option>
            {delegationTypes.map((delegationType, index) => {
              return (
                <option key={index} value={delegationType.id}>
                  {delegationType.name}
                </option>
              );
            })}
          </select>
          <select
            className="selectbox w-[49%]"
            value={estateType.name}
            onChange={(e: { currentTarget: { value: any } }) => {
              setEstateType({
                id: e.currentTarget.value,
                name: e.currentTarget.value,
                order:e.currentTarget.value
              });
            }}
          >
            <option value="default" disabled>
              {Strings.chooseEstateType}
            </option>
            {estateTypes.map((estateType, index) => {
              return (
                <option key={index} value={estateType.id}>
                  {estateType.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* <button
            onClick={async () => {
              await loadOptions();
            }}
          >
            refresh
          </button> */}
        {/* <div className="w-40 flex items-center text-white">
          <button
            className="text-sm bg-[#0ba] p-2 w-full"
            onClick={async () => {
              await saveChanges();
            }}
          >
            {Strings.saveChanges}
          </button>
        </div> */}
      </div>

      <div className="flex flex-row items-center justify-center mt-5">
        {isDefault ? (
          <h5 className="w-full text-center font-bold text-dark-blue">
            {Strings.chooseFormFilters}
          </h5>
        ) : loading ? (
          <div className="flex items-center w-full">
            <Spiner />
          </div>
        ) : (
          <div className="w-full">
            <div className="flex flex-row items-center justify-center gap-1">
              {/* <div className="flex flex-row items-center gap-1 justify-center w-56">
                <label className="text-sm text-dark-blue font-bold">
                  {Strings.imageSelectionFeature}
                </label>
                <input
                  type="checkbox"
                  className=""
                  checked={hasImage}
                  onChange={(e: {
                    target: {
                      checked: boolean | ((prevState: boolean) => boolean);
                    };
                  }) => {
                    handleImagesSection();
                    setHasImage(e.target.checked);
                  }}
                />
              </div> */}
              {/* {form.estateTypeId ? (
                <div className="flex flex-row items-center justify-end w-full">
                  <button
                    className="p-2 rounded-md shadow-sm bg-[#f3bc65] text-white"
                    onClick={() => {
                      setShowEditSectionModal(true);
                      setModalSection({
                        index: 0,
                        data: { fields: form.fields },
                      });
                    }}
                    disabled={isDefault}
                  >
                    {Strings.editForm}
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex flex-row items-center justify-between w-full">
                  <div className="text-gray-400">
                    چنین فرمی وجود ندارد!!! اگر تمایل دارید آنرا اضافه کنید..
                  </div>
                  <button
                    className="p-2 rounded-md shadow-sm bg-[#f3bc65] text-white"
                    onClick={() => {
                      setShowEditSectionModal(true);
                      setModalSection({
                        index: 0,
                        data: { fields: form.fields },
                      });
                    }}
                    disabled={isDefault}
                  >
                    {Strings.addForm}
                  </button>
                </div>
              )} */}
            </div>
            <DragDropContext onDragEnd={handleFieldDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => {
                  return (
                    <li
                      className="list-none"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ userSelect: "none" }}
                    >
                      <Draggable draggableId={v4()} index={0}>
                        {(provided) => {
                          return (
                            <ul
                              className="my-3 w-full gap-2 rounded-2xl p-2 flex flex-row flex-wrap"
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              {form.fields.map((field, fieldIndex) => {
                                if (field.type === FieldType.Image) return null;
                                return (
                                  <li
                                    className="rounded-2xl shadow-md p-2 bg-[#f6f6f6] text-sm"
                                    key={fieldIndex}
                                  >
                                    <div className="flex flex-row">
                                      <div>
                                        <h6 className="d-inline">
                                          {field.title}
                                        </h6>
                                      </div>
                                      <div>
                                        <h6 className="d-inline text-muted">
                                          {getFieldTypeAndNecessity(field)}
                                        </h6>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          );
                        }}
                      </Draggable>
                      {/* {hasImage ? (
                        <div
                          className="flex flex-row flex-wrap px-2"
                          key={v4()}
                        >
                          <div className="flex flex-row gap-1 items-center rounded-2xl shadow-md p-2 bg-[#f6f6f6] text-sm">
                            <div>
                              <h6 className="">{Strings.chooseImages}</h6>
                            </div>
                            <div>
                              <h6 className="d-inline text-muted">
                                {getFieldTypeAndNecessity({
                                  ...defaultField,
                                  type: FieldType.Image,
                                  title: Strings.chooseImages,
                                  value: [],
                                  optional: true,
                                })}
                              </h6>
                            </div>
                          </div>
                        </div>
                      ) : null} */}
                    </li>
                  );
                }}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>
    </>
  );
};

export default Forms;
