import EditItemModal from "components/EditItemModal/EditItemModal";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "components/EditItemModal/EditItemModalState";
import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import City, { defaultCity } from "global/types/City";
import Neighborhood from "global/types/Neighborhood";
import Province, { defaultProvince } from "global/types/Province";
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
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import LocationService from "services/api/LocationService/LocationService";
import ListItem from "../../../../../../components/ListItem/ListItem";

function NeighborhoodList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [removedItems, setRemovedItems] = useState<Neighborhood[]>([]);
  const [newItems, setNewItems] = useState<Neighborhood[]>([]);
  const [selectedProvince, setSelectedProvince] =
    useState<Province>(defaultProvince);
  const [selectedCity, setSelectedCity] = useState<City>(defaultCity);
  const [newNeighborhood, setNewNeighborhood] = useState<Neighborhood>({
    id: "",
    name: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useRecoilState(editItemModalState);

  const state = useRecoilValue(globalState);
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);
  const modalMounted = useRef(true);

  useEffect(() => {
    locationService.current.setToken(state.token);
    loadLocations();
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    if (modalState.editMap[EditItemType.Neighborhood]) {
      editNeighborhood();
    }

    return () => {
      modalMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.editMap[EditItemType.Neighborhood]]);

  const loadLocations = async () => {
    toast.promise(
      locationService.current
        .getAllProvinces()
        .then((fetchedProvinces) => {
          setProvinces(fetchedProvinces);
          if (selectedProvince?.id) {
            const province = fetchedProvinces.find(
              (p) => p.id === selectedProvince.id
            );
            if (province) {
              setSelectedProvince(province);
              setCities((prev) => province.cities);
              if (selectedCity?.id) {
                const city = province.cities.find(
                  (c) => c.id === selectedCity.id
                );
                if (city) {
                  setSelectedCity(city);
                  setNeighborhoods(city.neighborhoods);
                }
              }
            }
          } else {
            setSelectedProvince(defaultProvince);
            setSelectedCity(defaultCity);
          }
        })
        .catch((error) => {
          console.log(error);
        }),
      {
        success: Strings.loadingLocationsSuccess,
        loading: Strings.loadingLocations,
        error: Strings.loadingLocationsFailed,
      }
    );
  };

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    if (!mounted.current) {
      setLoading((prev) => false);
      return;
    }

    await loadLocations();
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
    const provinceId = selectedProvince?.id;
    const cityId = selectedCity?.id;
    if (!provinceId || !cityId) return;
    for (let i = 0; i < newItems.length; i++) {
      const neighborhood = newItems[i];
      await locationService.current.createNeighborhoodInCity(
        provinceId,
        cityId,
        neighborhood
      );
    }
  };

  const editNeighborhood = async () => {
    if (modalState.id === "") return;
    setLoading((prev) => true);

    let provinceId = selectedProvince?.id;
    let cityId = selectedCity?.id;

    if (!provinceId || !cityId) return;

    let updatedNeighborhood =
      await locationService.current.editNeighborhoodInCity(provinceId, cityId, {
        id: modalState.id,
        name: modalState.value,
        mapInfo: modalState.mapInfo,
      });

    if (updatedNeighborhood) {
      setCities((prev) => {
        let prevCity = prev.find((t) => t.id === cityId);
        if (prevCity) {
          let prevNeighborhood = prevCity.neighborhoods.find(
            (c) => c.id === updatedNeighborhood!.id
          );
          if (prevNeighborhood) {
            prevNeighborhood.name = updatedNeighborhood!.name;
            prevNeighborhood.mapInfo = updatedNeighborhood?.mapInfo;
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
    const provinceId = selectedProvince?.id;
    const cityId = selectedCity?.id;
    if (!provinceId || !cityId) return;
    for (let i = 0; i < removedItems.length; i++) {
      const neighborhood = removedItems[i];
      await locationService.current.deleteNeighborhoodInCity(
        provinceId,
        cityId,
        neighborhood.id
      );
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
              value={selectedCity.name}
              onChange={(e) => {
                const cityId = e.currentTarget.value;
                if (cityId) {
                  const city = cities.find((c) => c.id === cityId);
                  if (city) {
                    setSelectedCity({ ...city, id: city.id, name: city.id });
                    setNeighborhoods(city.neighborhoods);
                  }
                }
              }}
            >
              <option value="" disabled>
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
              value={selectedProvince.name}
              onChange={(e) => {
                const provinceId = e.currentTarget.value;
                if (provinceId) {
                  const province = provinces.find((p) => p.id === provinceId);
                  if (province) {
                    setSelectedProvince({
                      ...province,
                      id: province.id,
                      name: province.id,
                    });
                    setCities(province.cities);
                  }
                }
              }}
            >
              <option value="" disabled>
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
            <Button
              variant="dark"
              className="align-items-center pt-lg-2"
              onClick={async () => {
                await loadLocations();
              }}
            >
              <i className="bi-arrow-counterclockwise"></i>
            </Button>
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
                          setModalState({
                            ...defaultEditItemModalState,
                            id: neighborhood.id,
                            value: neighborhood.name,
                            displayMap: [...newMap],
                            mapInfo: neighborhood.mapInfo,
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
