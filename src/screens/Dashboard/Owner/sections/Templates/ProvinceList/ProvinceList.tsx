import Strings from 'global/constants/strings';
import { tokenAtom } from 'global/states/globalStates';
import Province from 'global/types/Province';
import React, { useEffect, useRef, useState } from 'react';
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

function ProvinceList() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [removedItems, setRemovedItems] = useState<Province[]>([]);
  const [newItems, setNewItems] = useState<Province[]>([]);
  const [newProvince, setNewProvince] = useState<Province>({
    id: '',
    name: '',
    cities: [],
  });
  const token = useRecoilValue(tokenAtom);
  const service = useRef(new ProvinceCityService());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    service.current.setToken(token);
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadData = async () => {
    if (!loading) {
      setLoading((prev) => true);
    }
    const data = await service.current.getAllProvinces();
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

  const deleteProvinces = async (provinces: Province[]) => {
    for (let i = 0; i < provinces.length; i++) {
      const province = provinces[i];
      await service.current.deleteProvince(province.id);
    }
  };

  const createNewProvinces = async (provinces: Province[]) => {
    for (let i = 0; i < provinces.length; i++) {
      const province = provinces[i];
      await service.current.createProvince(province);
    }
  };

  const saveChanges = async (
    newItems: Province[],
    removedItems: Province[]
  ) => {
    setLoading((prev) => true);
    await deleteProvinces(removedItems);
    await createNewProvinces(newItems);
    await loadData();
  };

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">{Strings.provinces}</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={async () => {
          console.log('reload');
          await loadData();
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
                newProvince.name.trim() !== '' &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      ...newProvince,
                      name: newProvince.name.trim(),
                    },
                  ]);
                setNewProvince({
                  ...newProvince,
                  name: '',
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder={Strings.addNewType}
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
        <Col sm={'auto'}>
          <Button
            variant="purple"
            className="my-4"
            onClick={async () => {
              await saveChanges(newItems, removedItems);
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

export default ProvinceList;
