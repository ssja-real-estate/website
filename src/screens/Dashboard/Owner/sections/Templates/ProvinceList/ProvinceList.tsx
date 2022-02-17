import EditItemModal from "components/EditItemModal/EditItemModal";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "components/EditItemModal/EditItemModalState";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import Province from "global/types/Province";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import LocationService from "services/api/LocationService/LocationService";
import ListItem from "../../../../../../components/ListItem/ListItem";

function ProvinceList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [removedItems, setRemovedItems] = useState<Province[]>([]);
  const [newItems, setNewItems] = useState<Province[]>([]);
  const [newProvince, setNewProvince] = useState<Province>({
    id: "",
    name: "",
    cities: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const service = useRef(new LocationService());
  const mounted = useRef(true);
  const modalMounted = useRef(true);

  useEffect(() => {
    service.current.setToken(state.token);
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    if (modalState.editMap[EditItemType.Province]) {
      editProvince();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.Province]]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const data = await service.current.getAllProvinces();

    if (!mounted.current) {
      setLoading((prev) => false);
      return;
    }

    setProvinces(data);
    setLoading((prev) => false);
  };

  const selectItemAsRemoved = (province: Province) => {
    setRemovedItems((prev) => {
      let prov = prev.find((item) => item.id === province.id);
      if (prov) {
        const newRemovedItems = prev.filter((item) => item.id !== province.id);
        return newRemovedItems;
      } else {
        const newRemovedItems = [...prev, province];
        return newRemovedItems;
      }
    });
  };

  const createNewProvinces = async () => {
    for (let i = 0; i < newItems.length; i++) {
      const province = newItems[i];
      await service.current.createProvince(province);
    }
  };

  const editProvince = async () => {
    if (modalState.id === "") return;

    let province = provinces.find((p) => p.id === modalState.id);

    setLoading((prev) => true);

    if (province) {
      let newType = await service.current.editProvince({
        id: modalState.id,
        name: modalState.value,
        cities: province !== undefined ? province.cities : [],
        mapInfo: modalState.mapInfo,
      });

      if (newType) {
        setProvinces((prev) => {
          let prevType = prev.find((t) => t.id === newType!.id);

          if (prevType) {
            prevType.name = newType!.name;
            prevType.mapInfo = newType?.mapInfo;
          }

          return prev;
        });
      }
    }

    if (modalMounted.current) {
      setModalState(defaultEditItemModalState);
    }
    setLoading((prev) => false);
  };

  const deleteProvinces = async () => {
    for (let i = 0; i < removedItems.length; i++) {
      const province = removedItems[i];
      await service.current.deleteProvince(province.id);
    }
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    await deleteProvinces();
    await createNewProvinces();
    await loadData();
  };

  return (
    <>
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.province}
        editItemType={EditItemType.Province}
      />
      <h4 className="mt-4 ms-3 d-inline">{Strings.provinces}</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={async () => {
          await loadData();
        }}
      >
        <i className="bi-arrow-counterclockwise"></i>
      </Button>
      <Row>
        <Col>
          <InputGroup className="my-4" style={{ direction: "ltr" }}>
            <Button
              variant="dark"
              onClick={() => {
                newProvince.name.trim() !== "" &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      ...newProvince,
                      name: newProvince.name.trim(),
                    },
                  ]);
                setNewProvince({
                  ...newProvince,
                  name: "",
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder={Strings.addNewProvince}
              value={newProvince.name}
              onChange={(e) => {
                setNewProvince({
                  ...newProvince,
                  name: e.target.value,
                });
              }}
            />
          </InputGroup>
        </Col>
        <Col sm={"auto"}>
          <Button
            variant="purple"
            className="my-4"
            onClick={async () => {
              await saveChanges();
              setNewItems([]);
              setRemovedItems([]);
            }}
          >
            {Strings.saveChanges}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {loading ? (
            <Spinner animation="border" variant="primary" className="my-5" />
          ) : (
            <ListGroup>
              {provinces.map((province, index) => {
                return (
                  <React.Fragment key={index}>
                    <ListItem
                      title={province.name}
                      onRemove={() => {
                        selectItemAsRemoved(province);
                      }}
                      onEdit={() => {
                        const newMap = buildMap(EditItemType.Province);
                        setModalState({
                          ...defaultEditItemModalState,
                          id: province.id,
                          value: province.name,
                          displayMap: [...newMap],
                          mapInfo: province.mapInfo,
                        });
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </ListGroup>
          )}
        </Col>
        <Col>
          <ListGroup>
            {newItems.map((newItem, index) => {
              return (
                <ListGroup.Item
                  key={index}
                  variant="warning"
                  action
                  className="new-item d-flex flex-row justify-content-between align-items-center"
                >
                  {newItem.name}
                  <i
                    className="bi-x-lg remove-icon"
                    onClick={() => {
                      setNewItems((prev) =>
                        prev.filter((_, id) => id !== index)
                      );
                    }}
                  ></i>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
}

export default ProvinceList;
