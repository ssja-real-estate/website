import EditItemModal from "components/EditItemModal/EditItemModal";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "components/EditItemModal/EditItemModalState";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import City from "global/types/City";
import Neighborhood from "global/types/Neighborhood";
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
import ProvinceCityService from "services/api/ProvinceCityService/ProvinceCityService";
import ListItem from "../../../../../../components/ListItem/ListItem";

function NeighborhoodList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [removedItems, setRemovedItems] = useState<Neighborhood[]>([]);
  const [newItems, setNewItems] = useState<Neighborhood[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province>({
    id: "",
    name: "default",
    cities: [],
  });
  const [selectedCity, setSelectedCity] = useState<City>({
    id: "",
    name: "default",
    neighborhoods: [],
  });
  const [newNeighborhood, setNewNeighborhood] = useState<Neighborhood>({
    id: "",
    name: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const geoLocationService = useRef(new ProvinceCityService());
  const mounted = useRef(true);
  const modalMounted = useRef(true);

  useEffect(() => {
    geoLocationService.current.setToken(state.token);
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    if (modalState.editMap[EditItemType.City]) {
      editNeighborhood();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.Neighborhood]]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const fetchedProvinces = await geoLocationService.current.getAllProvinces();

    if (!mounted.current) return;

    setProvinces((prev) => fetchedProvinces);

    if (selectedProvince.id) {
      const province = fetchedProvinces.find(
        (p) => p.id === selectedProvince.id
      );
      if (province) {
        setSelectedProvince(province);
        setCities((prev) => province.cities);

        if (selectedCity.id) {
          const city = province.cities.find((c) => c.id === selectedCity.id);
          if (city) {
            setSelectedCity(city);
            setNeighborhoods(city.neighborhoods);
          }
        }
      }
    } else {
      if (fetchedProvinces.length > 0) {
        const firstProvince = fetchedProvinces[0];
        setSelectedProvince(firstProvince);
        if (firstProvince.cities.length > 0) {
          setSelectedCity(firstProvince.cities[0]);
        }
      }
    }
    setLoading((prev) => false);
  };

  const selectItemAsDeleted = async (neighborhood: Neighborhood) => {
    setRemovedItems((prev) => {
      const item = prev.find((e) => e.id === neighborhood.id);
      if (item) {
        const newRemovedItems = prev.filter(
          (item) => item.id !== neighborhood.id
        );
        return newRemovedItems;
      } else {
        const newRemovedItems = [...prev, neighborhood];
        return newRemovedItems;
      }
    });
  };

  const createNewNeighborhoods = async () => {
    const provinceId = selectedProvince.id;
    const cityId = selectedCity.id;
    if (!provinceId || !cityId) return;
    // for (let i = 0; i < newItems.length; i++) {
    //   const neighborhood = newItems[i];
    //   await geoLocationService.current.createNeighborhoodInCity(
    //     provinceId,
    //     cityId,
    //     neighborhood
    //   );
    // }
    // setNeighborhoods((prev) => {
    //   prev.push(...newItems);
    //   return neighborhoods;
    // });
  };

  const editNeighborhood = async () => {
    if (modalState.id === "") return;
    setLoading((prev) => true);

    let provinceId = selectedProvince.id;
    let cityId = selectedCity.id;
    let updatedNeighborhood =
      await geoLocationService.current.editNeighborhoodInCity(
        provinceId,
        cityId,
        {
          id: modalState.id,
          name: modalState.value,
        }
      );
    if (updatedNeighborhood) {
      setCities((prev) => {
        let prevCity = prev.find((t) => t.id === provinceId);
        if (prevCity) {
          let prevNeighborhood = prevCity.neighborhoods.find(
            (c) => c.id === updatedNeighborhood!.id
          );
          if (prevNeighborhood) {
            prevNeighborhood.name = updatedNeighborhood!.name;
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

  const deleteNeighborhoods = async () => {
    const provinceId = selectedProvince.id;
    const cityId = selectedCity.id;
    if (!provinceId || !cityId) return;
    for (let i = 0; i < removedItems.length; i++) {
      // const neighborhood = removedItems[i];
      // await geoLocationService.current.deleteNeighborhoodInCity(
      //   provinceId,
      //   cityId,
      //   neighborhood.id
      // );
    }
  };

  const saveChanges = async () => {
    setLoading((prev) => true);
    await deleteNeighborhoods();
    await createNewNeighborhoods();
    await loadData();
  };

  return (
    <>
      <EditItemModal
        title={Strings.edit}
        placeholder={Strings.neighborhood}
        editItemType={EditItemType.Neighborhood}
      />
      <h4 className="mt-4 ms-3 d-inline">{Strings.neighborhoods}</h4>
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
                newNeighborhood.name.trim() !== "" &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      ...newNeighborhood,
                      name: newNeighborhood.name.trim(),
                    },
                  ]);
                setNewNeighborhood({
                  ...newNeighborhood,
                  name: "",
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder={Strings.addNewNeighborhood}
              value={newNeighborhood.name}
              onChange={(e) => {
                setNewNeighborhood({
                  ...newNeighborhood,
                  name: e.target.value,
                });
              }}
            />
            <Form.Select
              defaultValue="default"
              value={selectedCity.id}
              onChange={(e) => {
                const cityId = e.currentTarget.value;
                if (cityId) {
                  const city = cities.find((c) => c.id === cityId);
                  if (city) {
                    setSelectedCity(city);
                    setNeighborhoods(city.neighborhoods);
                  }
                }
              }}
            >
              <option value="default" disabled>
                {Strings.chooseCity}
              </option>
              {cities.map((city, index) => {
                return (
                  <option key={index} value={city.id}>
                    {city.name}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Select
              defaultValue="default"
              value={selectedProvince.id}
              onChange={(e) => {
                const provinceId = e.currentTarget.value;
                if (provinceId) {
                  const province = provinces.find((p) => p.id === provinceId);
                  if (province) {
                    setSelectedProvince(province);
                    setCities(province.cities);
                    if (province.cities && province.cities.length > 0) {
                      setSelectedCity(province.cities[0]);
                    }
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
              {neighborhoods &&
                neighborhoods.map((neighborhood, index) => {
                  return (
                    <React.Fragment key={index}>
                      <ListItem
                        title={neighborhood.name}
                        onRemove={() => {
                          selectItemAsDeleted(neighborhood);
                        }}
                        onEdit={() => {
                          const newMap = buildMap(EditItemType.Neighborhood);
                          if (!modalMounted.current) return;
                          setModalState({
                            ...defaultEditItemModalState,
                            id: neighborhood.id,
                            value: neighborhood.name,
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

export default NeighborhoodList;
