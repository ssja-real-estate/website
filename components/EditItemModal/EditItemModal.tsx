import React, { SetStateAction, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Strings from "../../data/strings";
import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
import CustomModal from "../modal/CustomModal";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "./EditItemModalState";

interface Props {
  title: string;
  placeholder: string;
  editItemType: EditItemType;
}

const EditItemModal: React.FC<Props> = (props) => {
  const [modalState, setModalState] = useRecoilState(editItemModalState);
  const [newValue, setNewValue] = useState("");
  const [mapInfo, setMapInfo] = useState<MapInfo>(defaultMapInfo);
  const [zoom, setZoom] = useState<string>("0");
  const [credit, setCredit] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    setNewValue(modalState.value);
    if (modalState.mapInfo) {
      setMapInfo(modalState.mapInfo);
      setZoom(modalState.mapInfo.zoom.toString());
    }
    setCredit(modalState.credit ?? 0);
    setDuration(modalState.duration ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.displayMap[props.editItemType]]);

  const cancel = () => {
    setModalState(defaultEditItemModalState);
    setNewValue("");
    setMapInfo(defaultMapInfo);
  };

  const submit = () => {
    const displayMap = buildMap(props.editItemType, false);
    const editMap = buildMap(props.editItemType);

    if (isNaN(+zoom)) {
      // toast.error(Strings.invalidZoomValue);
      return;
    }

    setModalState({
      ...modalState,
      value: newValue.trim(),
      displayMap: displayMap,
      editMap: editMap,
      mapInfo: { ...mapInfo, zoom: parseFloat(zoom) },
      title: newValue.trim(),
      credit,
      duration,
      // توجه: order را دست نمی‌زنیم، چون input مربوطه
      // خودش مستقیم modalState.order را آپدیت می‌کند.
    });
    setNewValue("");
    setMapInfo(defaultMapInfo);
    setZoom("0");
  };

  return (
    <CustomModal
      handleSuccess={submit}
      show={modalState.displayMap[props.editItemType]}
      handleClose={cancel}
    >
      <div>
        <div>
          <h2 className="text-dark-blue font-bold text-2xl px-3">ویرایش</h2>
        </div>
        <div className="w-full h-[1px] bg-gray-100 my-3"></div>
        <div className="px-3">
          <form>
            <div>
              <div>
                <label className="">{props.placeholder}</label>
                <input
                  className="inputDecoration my-1"
                  type="text"
                  value={newValue}
                  onChange={(e: {
                    currentTarget: { value: SetStateAction<string> };
                  }) => {
                    setNewValue(e.currentTarget.value);
                  }}
                />
              </div>

              {/* 🔹 اینجا را عوض کردیم: هم برای EstateType هم DelegationType */}
              {(props.editItemType === EditItemType.EstateType ||
                props.editItemType === EditItemType.DelegationType) && (
                <div>
                  <label>{Strings.order}</label>
                  <input
                    className="inputDecoration my-1"
                    type="number"
                    value={modalState.order ?? 0}
                    onChange={(e: {
                      currentTarget: { value: string | number };
                    }) => {
                      setModalState({
                        ...modalState,
                        order: +e.currentTarget.value,
                      });
                    }}
                  />
                </div>
              )}

              {props.editItemType === EditItemType.Province ||
              props.editItemType === EditItemType.City ||
              props.editItemType === EditItemType.Neighborhood ? (
                <>
                  <div>
                    <label>{Strings.latitude}</label>
                    <input
                      className="inputDecoration my-1"
                      type="number"
                      value={mapInfo.latitude}
                      onChange={(e: {
                        currentTarget: { value: string | number };
                      }) => {
                        setMapInfo({
                          ...mapInfo,
                          latitude: +e.currentTarget.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label>{Strings.longitude}</label>
                    <input
                      className="inputDecoration my-1"
                      type="number"
                      value={mapInfo.longitude}
                      onChange={(e: {
                        currentTarget: { value: string | number };
                      }) => {
                        setMapInfo({
                          ...mapInfo,
                          longitude: +e.currentTarget.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label>{Strings.zoom}</label>
                    <input
                      className="inputDecoration my-1"
                      type="number"
                      value={zoom}
                      onChange={(e: {
                        currentTarget: { value: SetStateAction<string> };
                      }) => {
                        setZoom(e.currentTarget.value);
                      }}
                    />
                  </div>
                </>
              ) : null}

              {props.editItemType === EditItemType.Payment ? (
                <>
                  <div>
                    <label>{Strings.creditAmount}</label>
                    <input
                      className="inputDecoration my-1"
                      type="number"
                      value={credit}
                      onChange={(e: {
                        currentTarget: { value: string | number };
                      }) => {
                        setCredit(+e.currentTarget.value);
                      }}
                    />
                  </div>
                  <div>
                    <label>{Strings.paymentDuration}</label>
                    <input
                      className="inputDecoration my-1"
                      type="number"
                      value={duration}
                      onChange={(e: {
                        currentTarget: { value: string | number };
                      }) => {
                        setDuration(+e.currentTarget.value);
                      }}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </form>
        </div>
        <div className="w-full h-[1px] bg-gray-100 my-3"></div>
      </div>
    </CustomModal>
  );
};

export default EditItemModal;
