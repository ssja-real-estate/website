import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import City from "global/types/City";
import Neighborhood from "global/types/Neighborhood";
import Province from "global/types/Province";
import React, { useState, useEffect, useRef } from "react";
import { Button, Row, Col, InputGroup, Form, ListGroup } from "react-bootstrap";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import LocationService from "services/api/LocationService/LocationService";
import ListItem from "../../../../../../components/ListItem/ListItem";

function NeighborhoodList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [selectedCity, setSelectedCity] = useState<City>();

  const state = useRecoilValue(globalState);
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);

  useEffect(() => {
    locationService.current.setToken(state.token);
    loadLocations();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const loadLocations = async () => {
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
        }
      })
      .catch((_) => {
        toast.error(Strings.loadingLocationsFailed);
      });
  };

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">{Strings.neighborhoods}</h4>

      <Row>
        <Col>
          <InputGroup className="my-4" style={{ direction: "ltr" }}>
            <Form.Select
              defaultValue="default"
              value={selectedCity?.id}
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
              value={selectedProvince?.id}
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
      </Row>
      <Row>
        <Col>
          {
            <ListGroup>
              {neighborhoods &&
                neighborhoods.map((neighborhood, index) => {
                  return (
                    <React.Fragment key={index}>
                      <ListItem title={neighborhood.name} />
                    </React.Fragment>
                  );
                })}
            </ListGroup>
          }
        </Col>
      </Row>
    </>
  );
}

export default NeighborhoodList;
