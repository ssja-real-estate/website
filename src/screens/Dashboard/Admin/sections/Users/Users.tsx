import User from 'global/types/User';
import { useState } from 'react';
import { Card, Col, Form, ListGroup, Row, Tab } from 'react-bootstrap';

function UsersSection() {
  const [searchValue, setSearchValue] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div className="users-section">
      <Tab.Container>
        <Row>
          <Col md={5} className="users-list">
            <h3 className="users-list-title fw-light mb-4">لیست کاربران</h3>
            <Form.Control
              className="mb-3"
              placeholder="جستجوی کاربران"
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
              }}
            ></Form.Control>
            <ListGroup>
              {users
                .filter((user) => {
                  const value = searchValue.trim();
                  if (value === '') return true;

                  let result = false;
                  if (user.name) {
                    result ||= user.name.includes(value);
                  }
                  result ||= user.mobile.includes(value);

                  return result;
                })
                .map((user, index) => {
                  return (
                    <ListGroup.Item
                      key={index}
                      action
                      href={`#user${user.mobile}`}
                    >
                      <div className="d-flex">
                        {user.name ? (
                          <span
                            className="user-name ms-3"
                            style={{ width: 200 }}
                          >
                            {user.name}
                          </span>
                        ) : null}
                        <span className="user-phone" style={{ width: 150 }}>
                          {user.mobile}
                        </span>
                      </div>
                    </ListGroup.Item>
                  );
                })}
            </ListGroup>
          </Col>
          <Col md={7} className="user-info">
            <Tab.Content className="sticky-top">
              <h3 className="user-info-title fw-light mb-4">مشخصات کاربر</h3>
              {users.map((user, index) => {
                return (
                  <Tab.Pane key={index} eventKey={`#user${user.mobile}`}>
                    <Card className="shadow p-5">
                      {user.name ? (
                        <span className="user-name fw-bold fs-4">
                          {user.name}
                          {/* {user.isAdmin ? (
                                                    <i className="bi-star-fill text-warning me-2"></i>
                                                ) : null} */}
                        </span>
                      ) : null}
                      <span className="user-phone pt-4">
                        {user.mobile}
                        <i className="bi-telephone-fill me-2"></i>
                      </span>
                    </Card>
                  </Tab.Pane>
                );
              })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default UsersSection;
