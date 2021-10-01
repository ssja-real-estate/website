import React from 'react';
import { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import toast from 'react-hot-toast';
import ListItem from '../../../../../../components/ListItem/ListItem';
import { DelegationType } from '../../../../../../global/types/Estate';
import { fetchGet, fetchPut } from '../../../../../../services/api/fetch';
import { randomId } from '../../../../../../services/utilities/randomId';
import './DelegationTypesList.css';

function DelegationTypesList() {
  const [delegationTypes, setDelegationTypes] = useState<DelegationType[]>([]);
  const [removedItems, setRemovedItems] = useState<DelegationType[]>([]);
  const [newItems, setNewItems] = useState<DelegationType[]>([]);
  const [newDelegationType, setNewDelegationType] = useState<DelegationType>({
    value: '',
    id: randomId(),
  });
  const [loading, setLoading] = useState<boolean>(true);

  async function getData(url: string) {
    fetchGet(url)
      .then((data) => {
        setDelegationTypes(data.data);
        setNewItems([]);
        setRemovedItems([]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getData('http://localhost:8000/delegationTypes');
  }, []);

  return (
    <>
      <h4 className="mt-4 ms-3 d-inline">نوع واگذاری ها</h4>
      <Button
        variant="dark"
        className="refresh-btn d-inline rounded-circle"
        onClick={() => {
          setLoading(true);
          getData('http://localhost:8000/delegationTypes');
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
                newDelegationType.value.trim() !== '' &&
                  setNewItems((prev) => [
                    ...prev,
                    {
                      id: randomId(),
                      value: newDelegationType.value.trim(),
                    },
                  ]);
                setNewDelegationType({
                  ...newDelegationType,
                  value: '',
                });
              }}
            >
              <i className="bi-plus-lg fs-6"></i>
            </Button>
            <Form.Control
              type="text"
              placeholder="افزودن نوع جدید"
              value={newDelegationType.value}
              onChange={(e) => {
                setNewDelegationType({
                  ...newDelegationType,
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
              const allItems = [...newItems, ...delegationTypes];
              const finalItems = allItems.filter(
                (item) =>
                  !removedItems
                    .map((removedItem) => removedItem.id)
                    .includes(item.id)
              );
              toast.promise(
                fetchPut('http://localhost:8000/delegationTypes', {
                  id: 1,
                  data: finalItems,
                }).then(() => {
                  getData('http://localhost:8000/delegationTypes');
                }),
                {
                  loading: 'در حال ذخیره سازی تغییرات',
                  success: 'تغییرات با موفقیت ذخیره شد',
                  error: 'خطا در ذخیره سازی تغییرات',
                },
                {
                  style: { width: 250 },
                }
              );
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
              {delegationTypes.map((delegationType, index) => {
                return (
                  <React.Fragment key={index}>
                    <ListItem
                      title={delegationType.value}
                      onRemove={() => {
                        setRemovedItems((prev) => {
                          let exists: boolean = false;
                          prev.every((item) => {
                            if (item.id === delegationType.id) {
                              exists = true;
                              return false;
                            } else {
                              return true;
                            }
                          });
                          if (exists) {
                            const newRemovedItems = prev.filter(
                              (item) => item.id !== delegationType.id
                            );
                            return newRemovedItems;
                          } else {
                            const newRemovedItems = [...prev, delegationType];
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

export default DelegationTypesList;
