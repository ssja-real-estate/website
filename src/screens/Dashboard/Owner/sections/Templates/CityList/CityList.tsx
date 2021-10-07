/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import toast from 'react-hot-toast';
import ListItem from '../../../../../../components/ListItem/ListItem';
import { City, Province } from '../../../../../../global/types/Estate';
import { randomId } from '../../../../../../services/utilities/randomId';

function CityList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [removedItems, setRemovedItems] = useState<City[]>([]);
  const [newItems, setNewItems] = useState<City[]>([]);
  const [newCity, setNewCity] = useState<City>({
    value: '',
    id: randomId(),
  });
  const [selectedProvince, setSelectedProvince] = useState<Province>();
  const [loading, setLoading] = useState<boolean>(true);

  async function getProvinceData(url: string) {
    // fetchGet(url)
    //   .then((data) => {
    //     setProvinces(data.data);
    //     setNewItems([]);
    //     setRemovedItems([]);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  async function getCityData(url: string) {
    // fetchGet(url)
    //   .then((data) => {
    //     setCities(data.data);
    //     setNewItems([]);
    //     setRemovedItems([]);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  useEffect(() => {
    getProvinceData('http://localhost:8000/provinces');
  }, []);

  useEffect(() => {
    setLoading(true);
    if (selectedProvince && selectedProvince.id !== 'default') {
      getCityData(`http://localhost:8000/cities/${selectedProvince?.id}`);
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
                newCity.value.trim() !== '' &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      id: randomId(),
                      value: newCity.value.trim(),
                    },
                  ]);
                setNewCity({
                  ...newCity,
                  value: '',
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder="افزودن شهر جدید"
              value={newCity.value}
              onChange={(e) => {
                setNewCity({
                  ...newCity,
                  value: e.target.value,
                });
              }}
            />
            <Form.Select
              defaultValue="default"
              value={selectedProvince?.value}
              onChange={(e) => {
                setSelectedProvince({
                  ...selectedProvince!,
                  id: e.currentTarget.value,
                });
              }}
            >
              <option value="default" disabled>
                انتخاب کنید
              </option>
              {provinces.map((province, index) => {
                return (
                  <option key={index} value={province.id}>
                    {province.value}
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
              setLoading(true);
              setNewItems([]);
              setRemovedItems([]);
              const allItems = [...newItems, ...cities];
              const finalItems = allItems.filter(
                (item) =>
                  !removedItems
                    .map((removedItem) => removedItem.id)
                    .includes(item.id)
              );
              // toast.promise(
              //   fetchPut(
              //     `http://localhost:8000/cities/${selectedProvince?.id}`,
              //     {
              //       id: randomId(),
              //       data: finalItems,
              //     }
              //   ).then(() => {
              //     getCityData(
              //       `http://localhost:8000/cities/${selectedProvince?.id}`
              //     );
              //   }),
              //   {
              //     loading: 'در حال ذخیره سازی تغییرات',
              //     success: 'تغییرات با موفقیت ذخیره شد',
              //     error: 'خطا در ذخیره سازی تغییرات',
              //   },
              //   {
              //     style: { width: 250 },
              //   }
              // );
            }}
          >
            ذخیره تغییرات
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
                        title={city.value}
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
                  {newItem.value}
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
