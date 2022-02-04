import EditItemModal from "components/EditItemModal/EditItemModal";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "components/EditItemModal/EditItemModalState";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import City from "global/types/City";
import Province from "global/types/Province";
import React, { useState, useEffect, useRef } from "react";
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

function CityList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [removedItems, setRemovedItems] = useState<City[]>([]);
  const [newItems, setNewItems] = useState<City[]>([]);
  const [newCity, setNewCity] = useState<City>({
    id: "",
    name: "",
    neighborhoods: [],
  });
  const [selectedProvince, setSelectedProvince] = useState<Province>();
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
    if (modalState.editMap[EditItemType.City]) {
      editCity();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.City]]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const provinces = await service.current.getAllProvinces();

    if (!mounted.current) return;

    setProvinces(provinces);
    if (selectedProvince) {
      const province = provinces.find((p) => p.id === selectedProvince.id);
      if (province) {
        setSelectedProvince(province);
        setCities(province.cities);
      }
    }
    setLoading((prev) => false);
  };

  const selectItemAsDeleted = async (city: City) => {
    setRemovedItems((prev) => {
      const item = prev.find((e) => e.id === city.id);
      if (item) {
        const newRemovedItems = prev.filter((item) => item.id !== city.id);
        return newRemovedItems;
      } else {
        const newRemovedItems = [...prev, city];
        return newRemovedItems;
      }
    });
  };

  const createNewCities = async () => {
    const provinceId = selectedProvince?.id;
    if (!provinceId) return;
    for (let i = 0; i < newItems.length; i++) {
      const city = newItems[i];
      await service.current.createCityInProvince(provinceId, city);
    }
  };

  const editCity = async () => {
    if (modalState.id === "") return;
    setLoading((prev) => true);

    let provinceId = selectedProvince?.id ?? "";
    let updatedCity = await service.current.editCityInProvince(provinceId, {
      id: modalState.id,
      name: modalState.value,
      neighborhoods: [],
    });
    if (updatedCity) {
      setProvinces((prev) => {
        let prevProvince = prev.find((t) => t.id === provinceId);
        if (prevProvince) {
          let prevCity = prevProvince.cities.find(
            (c) => c.id === updatedCity!.id
          );
          if (prevCity) {
            prevCity.name = updatedCity!.name;
          }
        }
        return prev;
      });
    }
    if (modalMounted.current) {
      setModalState(defaultEditItemModalState);
    }
    setLoading((prev) => false);
  };

  const deleteCities = async () => {
    const provinceId = selectedProvince?.id;
    if (!provinceId) return;
    for (let i = 0; i < removedItems.length; i++) {
      const city = removedItems[i];
      await service.current.deleteCityInProvince(provinceId, city);
    }
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    await deleteCities();
    await createNewCities();
    await loadData();
  };

  return (
    <>
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.city}
        editItemType={EditItemType.City}
      />
      <h4 className="mt-4 ms-3 d-inline">{Strings.cities}</h4>
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
                newCity.name.trim() !== "" &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      ...newCity,
                      name: newCity.name.trim(),
                    },
                  ]);
                setNewCity({
                  ...newCity,
                  name: "",
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder={Strings.addNewCity}
              value={newCity.name}
              onChange={(e) => {
                setNewCity({
                  ...newCity,
                  name: e.target.value,
                });
              }}
            />
            <Form.Select
              defaultValue="default"
              value={selectedProvince?.id}
              onChange={(e) => {
                const provinceId = e.currentTarget.value;
                if (provinceId) {
                  const province = provinces.find((p) => p.id === provinceId);
                  if (province) {
                    setSelectedProvince(province);
                    setCities(province.cities);
                  }
                }
              }}
            >
              <option value="default" disabled>
                {Strings.chooseProvince}
              </option>
              {provinces.map((province, index) => {
                return (
                  <option key={index} value={province.id}>
                    {province.name}
                  </option>
                );
              })}
            </Form.Select>
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
              {cities &&
                cities.map((city, index) => {
                  return (
                    <React.Fragment key={index}>
                      <ListItem
                        title={city.name}
                        onRemove={() => {
                          selectItemAsDeleted(city);
                        }}
                        onEdit={() => {
                          const newMap = buildMap(EditItemType.City);
                          if (!modalMounted.current) return;
                          setModalState({
                            ...defaultEditItemModalState,
                            id: city.id,
                            value: city.name,
                            displayMap: [...newMap],
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

export default CityList;
