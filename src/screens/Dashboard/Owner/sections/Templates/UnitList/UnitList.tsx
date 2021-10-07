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
import { Unit } from '../../../../../../global/types/Estate';
import { randomId } from '../../../../../../services/utilities/randomId';

function UnitList() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [removedItems, setRemovedItems] = useState<Unit[]>([]);
  const [newItems, setNewItems] = useState<Unit[]>([]);
  const [newUnit, setNewUnit] = useState<Unit>({
    value: '',
    id: randomId(),
  });
  const [loading, setLoading] = useState<boolean>(true);

  async function getData(url: string) {
    // fetchGet(url)
    //   .then((data) => {
    //     setUnits(data.data);
    //     setNewItems([]);
    //     setRemovedItems([]);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  useEffect(() => {
    getData('http://localhost:8000/units');
  }, []);

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">واحد ها</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={() => {
          setLoading(true);
          getData('http://localhost:8000/units');
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
                newUnit.value.trim() !== '' &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      id: randomId(),
                      value: newUnit.value.trim(),
                    },
                  ]);
                setNewUnit({
                  ...newUnit,
                  value: '',
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder="افزودن واحد جدید"
              value={newUnit.value}
              onChange={(e) => {
                setNewUnit({
                  ...newUnit,
                  value: e.target.value,
                });
              }}
            />
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
              const allItems = [...newItems, ...units];
              const finalItems = allItems.filter(
                (item) =>
                  !removedItems
                    .map((removedItem) => removedItem.id)
                    .includes(item.id)
              );
              // toast.promise(
              //   fetchPut('http://localhost:8000/units', {
              //     id: 1,
              //     data: finalItems,
              //   }).then(() => {
              //     getData('http://localhost:8000/units');
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
              {units.map((unit, index) => {
                return (
                  <React.Fragment key={index}>
                    <ListItem
                      title={unit.value}
                      onRemove={() => {
                        setRemovedItems((prev) => {
                          let exists: boolean = false;
                          prev.every((item) => {
                            if (item.id === unit.id) {
                              exists = true;
                              return false;
                            } else {
                              return true;
                            }
                          });
                          if (exists) {
                            const newRemovedItems = prev.filter(
                              (item) => item.id !== unit.id
                            );
                            return newRemovedItems;
                          } else {
                            const newRemovedItems = [...prev, unit];
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

export default UnitList;
