import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import City from "global/types/City";
import Province from "global/types/Province";
import { useState, useEffect, useRef } from "react";
import { Button, ListGroup, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import LocationService from "services/api/LocationService/LocationService";
import "./CityList.css";

function CityList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province>();

  const state = useRecoilValue(globalState);
  const locationService = useRef(new LocationService());
  const mounted = useRef(true);

  useEffect(() => {
    locationService.current.setToken(state.token);
    loadProvinces();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const loadProvinces = async () => {
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
          }
        }
      })
      .catch((_) => {
        toast.error(Strings.loadingLocationsFailed);
      });
  };

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">{Strings.cities}</h4>
      <div className="d-flex flex-row justify-content-center mt-3">
        <Button
          variant="dark"
          className="align-items-center pt-lg-2"
          onClick={async () => {
            await loadProvinces();
          }}
        >
          <i className="bi-arrow-counterclockwise"></i>
        </Button>
        <Form.Select
          style={{ maxWidth: 300 }}
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
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <ListGroup className="mt-3" style={{ minWidth: 300, maxWidth: 400 }}>
          {cities &&
            cities.map((city, index) => {
              return <ListGroup.Item key={index}>{city.name}</ListGroup.Item>;
            })}
        </ListGroup>
      </div>
    </>
  );
}

export default CityList;
