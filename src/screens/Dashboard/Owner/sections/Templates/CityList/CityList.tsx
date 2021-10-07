/* eslint-disable @typescript-eslint/no-unused-vars */
import Strings from 'global/constants/strings';
import { tokenAtom } from 'global/states/globalStates';
import City from 'global/types/City';
import Province from 'global/types/Province';
import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import ProvinceCityService from 'services/api/ProvinceCityService/ProvinceCityService';
import ListItem from '../../../../../../components/ListItem/ListItem';

function CityList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [removedItems, setRemovedItems] = useState<City[]>([]);
  const [newItems, setNewItems] = useState<City[]>([]);
  const [newCity, setNewCity] = useState<City>({
    id: '',
    name: '',
  });
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [loading, setLoading] = useState<boolean>(true);
  const token = useRecoilValue(tokenAtom);
  const service = useRef(new ProvinceCityService());

  useEffect(() => {
    service.current.setToken(token);
  }, [token]);

  async function getProvinceData(url: string) {}

  async function getCityData(url: string) {}

  useEffect(() => {
    setLoading(true);
    if (selectedProvince && selectedProvince.id !== 'default') {
      getCityData(`http://localhost:8000/cities/${selectedProvince.id}`);
    }
  }, [selectedProvince]);

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">شهر ها</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={() => {
          setLoading(true);
          getProvinceData('http://localhost:8000/provinces');
          getCityData(`http://localhost:8000/cities`);
        }}
      >
        <i className="bi-arrow-counterclockwise"></i>
      </Button>
      <Row>
        <Col>
          <InputGroup className="my-4" style={{ direction: 'ltr' }}>
            <Button
              variant="dark"
              onClick={() => {
                newCity.name.trim() !== '' &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      ...newCity,
                      name: newCity.name.trim(),
                    },
                  ]);
                setNewCity({
                  ...newCity,
                  name: '',
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
              value={selectedProvince?.name}
              onChange={(e) => {
                setSelectedProvince({
                  ...selectedProvince!,
                  id: e.currentTarget.value,
                });
              }}
            >
              <option value="default" disabled>
                {Strings.choose}
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
        <Col sm={'auto'}>
          <Button
            variant="purple"
            className="my-4"
            onClick={() => {
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
                          setRemovedItems((prev) => {
                            let exists: boolean = false;
                            prev.every((item) => {
                              if (item.id === city.id) {
                                exists = true;
                                return false;
                              } else {
                                return true;
                              }
                            });
                            if (exists) {
                              const newRemovedItems = prev.filter(
                                (item) => item.id !== city.id
                              );
                              return newRemovedItems;
                            } else {
                              const newRemovedItems = [...prev, city];
                              return newRemovedItems;
                            }
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
                    className="remove-icon bi-x-lg"
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
